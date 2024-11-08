// src/pages/ForgotPassword.js
import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../components/Input';

const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log("Forgot Password Data: ", data);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
                <Input label="Email" name="email" type="email" register={register} required errors={errors} />
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded mt-4">Send Reset Link</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
