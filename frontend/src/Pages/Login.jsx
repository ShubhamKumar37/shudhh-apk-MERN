// src/pages/Login.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import { useDispatch } from 'react-redux';
import { login } from '../services/operations/authAPI';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onSubmit = (data) => {
        console.log("Login Data: ", data);
        dispatch(login(data, navigate));

    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Login</h2>

                <Input label="Email" name="email" type="email" register={register} required errors={errors} />
                <Input label="Password" name="password" type="password" register={register} required errors={errors} />

                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg mt-4 hover:bg-blue-700 transition duration-200">
                    Login
                </button>
                <Link to="/forgot-password" className="text-blue-600 text-center block mt-4 hover:underline">Forgot Password? </Link>
            </form>
        </div>

    );
};

export default Login;
