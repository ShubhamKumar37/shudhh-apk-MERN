// src/pages/Signup.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../components/Input';
import { GoEye, GoEyeClosed  } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { setSignupData } from '../slices/authSlice';
import { sendOTP } from '../services/operations/authAPI';
import { useDispatch } from 'react-redux';

const Signup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onSubmit = async(data) => {

        if(data.password !== data.confirmPassword){
            alert("Passwords do not match");
            return;
        }

        console.log("Signup Data: ", data);
        const response = await sendOTP(data.email);
        if(response.status === 401){
            navigate('/');
            return ;
        }
        console.log(response);
        dispatch(setSignupData(data));
        navigate("/otp");
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
                <Input label="Name" name="name" register={register} required errors={errors} />
                <Input label="Email" name="email" type="email" register={register} required errors={errors} />
                <div className="relative">
                    <Input label="Password" name="password" type={showPassword ? "text" : "password"} register={register} required errors={errors} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-0 right-0 mt-2 mr-2 text-xl text-blue-600">
                        {showPassword ? <GoEyeClosed /> :<GoEye />}
                    </button>
                </div>
                <div className="relative">  
                    <Input label="Confirm Password" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} register={register} required errors={errors} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute top-0 right-0 mt-2 mr-2 text-xl text-blue-600">
                        {showConfirmPassword ? <GoEyeClosed /> :<GoEye />}
                    </button>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded mt-4">Send OTP</button>
            </form>
        </div>
    );
};

export default Signup;

