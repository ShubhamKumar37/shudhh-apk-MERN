import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Input, FileInput } from '../components';
import toast from 'react-hot-toast';
import { apiConnector } from '../services/apiConnector';
import { userAuth } from '../services/apis';
import { useNavigate } from 'react-router-dom';
import { setUserData } from '../slices/authSlice';


const UpdateUserForm = () => {
    const { userData } = useSelector((state) => state.auth);
    const { UPDATE_USER } = userAuth;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: userData?.name || '',
            phoneNumber: userData?.phoneNumber || '',
            address: userData?.address || '',
            profilePicture: null,
        },
    });

    const onFormSubmit = async (data) => {
        const formData = new FormData();
        
        // Append all non-empty fields to formData
        Object.entries(data).forEach(([key, value]) => {
            if (value && value.toString().trim() !== '') {
                formData.append(key, typeof value === 'string' ? value.trim() : value);
            }
        });

        // Add publicId and profilePicture
        if (userData?.profilePicture?.public_id) {
            formData.append("publicId", userData.profilePicture.public_id);
        }
        if (data.profilePicture && data.profilePicture.length) {
            formData.append("profilePicture", data.profilePicture[0]);
        }
        
        console.log("FormData entries:");
        for (let [key, value] of formData.entries()) {
            console.log(key, ':', value);
        }

        try {

            for (var pair of formData.entries()) {
                console.log(pair[0] + ':', pair[1]);
            }

            toast.loading("Updating profile...");
            const response = await apiConnector("PUT", UPDATE_USER, formData);
            console.log("This is response: of updated file", response.data);
            if (response.data.success) {
                toast.dismiss();
            } else {
                toast.dismiss();
                toast.error(response.data.message);
            }
            toast.success("Profile updated successfully");
            dispatch(setUserData(response.data.data));
            localStorage.setItem("userData", JSON.stringify(response.data.data));
            // navigate("/");


        }
        catch (error) {
            toast.dismiss();
            toast.error("Something went wrong, profile is not updated");
            console.log("Error in updating user: ", error);
        }
        console.log("This is the data ", formData);
    };

    return (
        <div className="bg-white min-h-screen flex items-center justify-center py-12 px-4">
            <div className="w-[40rem] p-[2rem] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                <div className="bg-white w-[90%] p-8 rounded-2xl shadow-lg lg:w-1/2 lg:flex lg:flex-col lg:items-center lg:justify-center">
                    <h2 className="text-3xl font-extrabold text-center mb-8">Update Profile</h2>

                    <form onSubmit={handleSubmit(onFormSubmit)} className="w-full">
                        <Input
                            label="Name"
                            name="name"
                            register={register}
                            required={false}
                            errors={errors}
                            placeholder="Enter your name"
                        />

                        <Input
                            label="Phone Number"
                            name="phoneNumber"
                            type="tel"
                            register={register}
                            required={false}
                            errors={errors}
                            placeholder="Enter your phone number"
                        />

                        <Input
                            label="Address"
                            name="address"
                            register={register}
                            required={false}
                            errors={errors}
                            placeholder="Enter your address"
                        />

                        <FileInput
                            label="Profile Picture"
                            name="profilePicture"
                            register={register}
                            required={false}
                            errors={errors}
                        />

                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-blue-700 transition duration-200"
                            >
                                Update Profile
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateUserForm;

