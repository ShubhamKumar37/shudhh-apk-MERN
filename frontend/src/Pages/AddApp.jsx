// src/components/AppForm.js
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FileInput, Input } from '../components';


const AppForm = () => {
    const { register, handleSubmit, control, formState: { errors } } = useForm();

    // Field arrays for inputs like tags, languages, permissions, and keywords
    const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({ control, name: "tag" });
    const { fields: languageFields, append: appendLanguage, remove: removeLanguage } = useFieldArray({ control, name: "language" });
    const { fields: permissionFields, append: appendPermission, remove: removePermission } = useFieldArray({ control, name: "appPermission" });
    const { fields: searchKeywordFields, append: appendSearchKeyword, remove: removeSearchKeyword } = useFieldArray({ control, name: "searchKeywords" });

    const onSubmit = (data) => {
        // Handle file inputs as arrays or single files
        const appFile = data.appFile[0];
        const appIcon = data.appIcon[0];
        const appMedia = data.appMedia;
        console.log({ ...data, appFile, appIcon, appMedia });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">App Information Form</h2>
            
            {/* Single Value Inputs */}
            <Input label="App Name" name="appName" register={register} required placeholder="Enter App Name" errors={errors} />
            <Input label="App Description" name="appDescription" register={register} required placeholder="Enter App Description" errors={errors} />
            <Input label="Company Name" name="companyName" register={register} placeholder="Enter Company Name" errors={errors} />
            <Input label="Category" name="category" register={register} placeholder="Enter Category" errors={errors} />
            <Input label="Size" name="size" register={register} placeholder="Enter Size" errors={errors} />
            <Input label="Download Count" name="download" register={register} placeholder="Enter Download Count" errors={errors} />
            <Input label="Release Date" name="releaseDate" register={register} placeholder="Enter Release Date" errors={errors} />
            <Input label="System Requirement" name="systemRequirement" register={register} placeholder="Enter System Requirement" errors={errors} />

            {/* Array Input: Tags */}
            <label className="block text-gray-700 font-semibold mb-2">Tags</label>
            {tagFields.map((item, index) => (
                <div key={item.id} className="flex items-center mb-2 space-x-2">
                    <Input label={`Tag ${index + 1}`} name={`tag.${index}`} register={register} placeholder={`Enter Tag ${index + 1}`} errors={errors} />
                    <button type="button" onClick={() => removeTag(index)} className="text-red-500 hover:text-red-700">Remove</button>
                </div>
            ))}
            <button type="button" onClick={() => appendTag('')} className="text-blue-500 mb-4">+ Add Tag</button>

            {/* Array Input: Languages */}
            <label className="block text-gray-700 font-semibold mb-2">Languages</label>
            {languageFields.map((item, index) => (
                <div key={item.id} className="flex items-center mb-2 space-x-2">
                    <Input label={`Language ${index + 1}`} name={`language.${index}`} register={register} placeholder={`Enter Language ${index + 1}`} errors={errors} />
                    <button type="button" onClick={() => removeLanguage(index)} className="text-red-500 hover:text-red-700">Remove</button>
                </div>
            ))}
            <button type="button" onClick={() => appendLanguage('')} className="text-blue-500 mb-4">+ Add Language</button>

            {/* Array Input: App Permissions */}
            <label className="block text-gray-700 font-semibold mb-2">App Permissions</label>
            {permissionFields.map((item, index) => (
                <div key={item.id} className="flex items-center mb-2 space-x-2">
                    <Input label={`Permission ${index + 1}`} name={`appPermission.${index}`} register={register} placeholder={`Enter Permission ${index + 1}`} errors={errors} />
                    <button type="button" onClick={() => removePermission(index)} className="text-red-500 hover:text-red-700">Remove</button>
                </div>
            ))}
            <button type="button" onClick={() => appendPermission('')} className="text-blue-500 mb-4">+ Add Permission</button>

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
                    <button type="button" onClick={() => removeSearchKeyword(index)} className="text-red-500 hover:text-red-700">Remove</button>
                </div>
            ))}
            <button type="button" onClick={() => appendSearchKeyword('')} className="text-blue-500 mb-4">+ Add Search Keyword</button>

            {/* File Inputs */}
            <FileInput label="App File" name="appFile" register={register} required errors={errors} />
            <FileInput label="App Icon" name="appIcon" register={register} required errors={errors} />
            <FileInput label="App Media" name="appMedia" register={register} required errors={errors} multiple={true} />

            <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md mt-4 hover:bg-blue-700 transition">Submit</button>
        </form>
    );
};

export default AppForm;
