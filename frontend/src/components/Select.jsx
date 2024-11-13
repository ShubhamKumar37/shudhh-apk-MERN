import React from 'react';

const Select = ({ label, name, register, required, errors, options }) => {
    console.log("Options: ", options);
    return (
        <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">{label}</label>
            <select
                {...register(name, { required })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            >
                <option value="" disabled>Select {label}</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {errors[name] && <span className="text-red-500 text-sm">This field is required</span>}
        </div>
    );
};

export default Select;
