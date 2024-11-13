import React, { useState } from 'react'
import { Input } from '../components'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GoEye, GoEyeClosed } from "react-icons/go";
import { apiConnector } from '../services/apiConnector';
import { userAuth } from '../services/apis';


const ResetPassword = () => {
    const { RESET_PASSWORD_USER } = userAuth;
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();
    const resetToken = useParams();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        console.log(data, resetToken.id);
        const formData = new FormData();
        formData.append('token', resetToken.id);
        formData.append('password', data.password);
        formData.append('confirmPassword', data.confirmPassword);
        try {
            const updatePasswordResponse = await apiConnector("PUT", RESET_PASSWORD_USER, formData);
            if (updatePasswordResponse.status !== 200) toast.error(updatePasswordResponse.data.message);

            toast.success(updatePasswordResponse.data.message);
            toast.loading("Redirecting to login page");

            setTimeout(() => {
                toast.dismiss();
                navigate('/login');
            }, 3000);

        }
        catch (error) {
            toast.error("Something went wrong");
            console.log("Error: ", error);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-lg w-96">
                <p className="text-center font-semibold text-3xl text-blue-600 mb-5">Change your password</p>

                <div className="relative mb-4">
                    <Input label="Password" name="password" type={showPassword ? "text" : "password"} register={register} required errors={errors} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-0 right-0 mt-2 mr-2 text-xl text-blue-600">
                        {showPassword ? <GoEyeClosed /> : <GoEye />}
                    </button>
                </div>

                <div className="relative mb-6">
                    <Input label="Confirm Password" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} register={register} required errors={errors} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute top-0 right-0 mt-2 mr-2 text-xl text-blue-600">
                        {showConfirmPassword ? <GoEyeClosed /> : <GoEye />}
                    </button>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200">
                    Change password
                </button>
            </form>
        </div>

    )
}

export default ResetPassword
