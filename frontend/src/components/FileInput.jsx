import React from 'react';

const FileInput = ({ label, name, register, required, errors, multiple = false }) => {
    return (
        <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">{label}</label>
            <input
                type="file"
                {...register(name, { required })}
                className="w-full border border-gray-300 rounded-md focus:outline-none"
                multiple={multiple}
            />
            {errors[name] && <span className="text-red-500 text-sm">This field is required</span>}
        </div>
    );
};

export default FileInput;
