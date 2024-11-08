// src/components/Input.js
import React from 'react';

const Input = ({ label, name, type = "text", register, required, errors }) => {
    return (
        <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">{label}</label>
            <input
                type={type}
                {...register(name, { required })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
            {errors[name] && <span className="text-red-500 text-sm">This field is required</span>}
        </div>
    );
};

export default Input;
