// src/pages/Login.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Input from '../components/Input';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log("Login Data: ", data);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                <Input label="Email" name="email" type="email" register={register} required errors={errors} />
                <Input label="Password" name="password" type="password" register={register} required errors={errors} />
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded mt-4">Login</button>
                <Link to="/forgot-password" className="text-blue-600 text-center block mt-4">Forgot Password?</Link>
            </form>
        </div>
    );
};

export default Login;
