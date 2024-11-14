// src/components/AppForm.js
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FileInput, Input, Select } from '../components';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createApp } from '../services/operations/appAPI';
import toast from 'react-hot-toast';
import { apiConnector } from '../services/apiConnector';
import { categoryApi } from '../services/apis';

const AppForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);
    const { GET_ALL_CATEGORIES } = categoryApi;
    const userData = useSelector((state) => state.auth.userData);
    console.log("This is userData:---------------- ", userData);
    const { register, handleSubmit, control, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Field arrays for array-based inputs
    const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({ control, name: "tag" });
    const { fields: languageFields, append: appendLanguage, remove: removeLanguage } = useFieldArray({ control, name: "language" });
    const { fields: permissionFields, append: appendPermission, remove: removePermission } = useFieldArray({ control, name: "appPermission" });
    const { fields: searchKeywordFields, append: appendSearchKeyword, remove: removeSearchKeyword } = useFieldArray({ control, name: "searchKeywords" });

    const onSubmit = async (data) => {
        if (isSubmitting) return;  // Prevent multiple submissions
        setIsSubmitting(true);  // Set submitting status to true
        try {
            const formData = new FormData();

            // Add single-value fields
            formData.append("appName", data.appName);
            formData.append("appDescription", data.appDescription);
            formData.append("companyName", data.companyName || "");
            formData.append("size", data.size || "");
            formData.append("download", data.download || 0);
            formData.append("releaseDate", data.releaseDate || "");
            formData.append("systemRequirement", data.systemRequirement || "");
            formData.append("inAppPurchase", data.inAppPurchase || false);
            formData.append("providedBy", userData._id);
            formData.append("category", data.category);

            data.tag.forEach((tag) => formData.append("tag", tag));
            data.language.forEach((lang) => formData.append("language", lang));
            data.appPermission.forEach((perm) => formData.append("appPermission", perm));
            data.searchKeywords.forEach((keyword) => formData.append("searchKeywords", keyword));

            // Add files
            formData.append("appFile", data.appFile[0]);
            formData.append("appIcon", data.appIcon[0]);
            Array.from(data.appMedia).forEach((file) => formData.append("appMedia", file));


            // for (var pair of formData.entries()) {
            //     console.log(pair[0] + ':', pair[1]);
            // }
            // console.log("This is the option and its datatype: ", data.category[0], typeof data.category);

            const response = dispatch(createApp(formData, navigate));
            if (response.status === 200) {
                console.log("App created successfully");
                toast.success("App created successfully");
            }
            console.log("This is response: ", response);

        } catch (error) {
            console.error("Error creating app:", error);
        }
        finally {
            setIsSubmitting(false);  // Reset submission state
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await apiConnector("GET", GET_ALL_CATEGORIES);
                setCategories(res.data.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCategories();
        console.log("This is categories: ", categories);
    }, []);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">App Information Form</h2>

            {/* Single Value Inputs */}
            <Input label="App Name" name="appName" register={register} required placeholder="Enter App Name" errors={errors} />
            <Input label="App Description" name="appDescription" register={register} required placeholder="Enter App Description" errors={errors} />
            <Input label="Company Name" name="companyName" register={register} placeholder="Enter Company Name" errors={errors} />
            <Input label="Size" name="size" register={register} placeholder="Enter Size" errors={errors} />
            <Input label="Download Count" name="download" type="number" register={register} placeholder="Enter Download Count" errors={errors} />
            <Input label="Release Date" name="releaseDate" register={register} placeholder="Enter Release Date" errors={errors} />
            <Input label="System Requirement" name="systemRequirement" register={register} placeholder="Enter System Requirement" errors={errors} />

            <Select
                label="Category"
                name="category"
                register={register}
                required
                errors={errors}
                options={categories.map(category => ({ value: category._id, label: category.name }))}
                className="mt-4"
            />

            {/* Array Input: Tags */}
            <label className="block text-gray-700 font-semibold mb-2">Tags</label>
            {tagFields.map((item, index) => (
                <div key={item.id} className="flex items-center mb-2 space-x-2">
                    <Input label={`Tag ${index + 1}`} name={`tag.${index}`} register={register} placeholder={`Enter Tag ${index + 1}`} errors={errors} />
                    <button type="button" onClick={() => removeTag(index)} className="text-red-500 hover:text-red-700">
                        Remove
                    </button>
                </div>
            ))}
            <button type="button" onClick={() => appendTag('')} className="text-blue-500 mb-4">
                + Add Tag
            </button>

            {/* Array Input: Languages */}
            <label className="block text-gray-700 font-semibold mb-2">Languages</label>
            {languageFields.map((item, index) => (
                <div key={item.id} className="flex items-center mb-2 space-x-2">
                    <Input label={`Language ${index + 1}`} name={`language.${index}`} register={register} placeholder={`Enter Language ${index + 1}`} errors={errors} />
                    <button type="button" onClick={() => removeLanguage(index)} className="text-red-500 hover:text-red-700">
                        Remove
                    </button>
                </div>
            ))}
            <button type="button" onClick={() => appendLanguage('')} className="text-blue-500 mb-4">
                + Add Language
            </button>

            {/* Array Input: App Permissions */}
            <label className="block text-gray-700 font-semibold mb-2">App Permissions</label>
            {permissionFields.map((item, index) => (
                <div key={item.id} className="flex items-center mb-2 space-x-2">
                    <Input label={`Permission ${index + 1}`} name={`appPermission.${index}`} register={register} placeholder={`Enter Permission ${index + 1}`} errors={errors} />
                    <button type="button" onClick={() => removePermission(index)} className="text-red-500 hover:text-red-700">
                        Remove
                    </button>
                </div>
            ))}
            <button type="button" onClick={() => appendPermission('')} className="text-blue-500 mb-4">
                + Add Permission
            </button>

            {/* In-App Purchase Checkbox */}
            <div className="flex items-center space-x-2 mb-4">
                <label className="block text-gray-700 font-semibold">In-App Purchase</label>
                <input type="checkbox" className="mr-2" {...register("inAppPurchase")} />
            </div>

            {/* Array Input: Search Keywords */}
            <label className="block text-gray-700 font-semibold mb-2">Search Keywords</label>
            {searchKeywordFields.map((item, index) => (
                <div key={item.id} className="flex items-center mb-2 space-x-2">
                    <Input label={`Search Keyword ${index + 1}`} name={`searchKeywords.${index}`} register={register} placeholder={`Enter Search Keyword ${index + 1}`} errors={errors} />
                    <button type="button" onClick={() => removeSearchKeyword(index)} className="text-red-500 hover:text-red-700">
                        Remove
                    </button>
                </div>
            ))}
            <button type="button" onClick={() => appendSearchKeyword('')} className="text-blue-500 mb-4">
                + Add Search Keyword
            </button>

            {/* File Inputs */}
            <FileInput label="App File" name="appFile" register={register} required errors={errors} />
            <FileInput label="App Icon" name="appIcon" register={register} required errors={errors} />
            <FileInput label="App Media (use Ctrl + Click)" name="appMedia" register={register} required errors={errors} multiple={true} />

            <button type="submit" className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg mt-6 hover:bg-blue-700 transition duration-200">
                Submit
            </button>
        </form>

    );
};

export default AppForm;
