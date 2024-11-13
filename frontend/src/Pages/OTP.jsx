import React, { useState } from 'react';
import OtpInput from 'react-otp-input';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../services/operations/authAPI';
import { useNavigate } from 'react-router-dom';

const OTP = () => {

    let userData = useSelector((state) => state.auth.signupData);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [otp, setOtp] = useState('');

    const handleOtpChange = (otpValue) => {
        setOtp(otpValue);
    };

    const handleSubmit = () => {
        if (otp.length === 6) {
            console.log(`OTP entered: ${otp}`);
        } else {
            alert('Please enter a valid 6-digit OTP.');
            console.log('Please enter a valid 6-digit OTP.');
        }

        userData = {
            ...userData,
            otp: otp
        };
        console.log("Yaha toh aya hun", userData);

        dispatch(signup(userData, navigate));

    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center">Enter OTP</h2>

                <OtpInput
                    value={otp}
                    onChange={handleOtpChange}
                    numInputs={6} // 6 input fields for OTP
                    separator={<span>-</span>} // Optional separator between OTP fields
                    shouldAutoFocus
                    renderInput={(props) => (
                        <input
                            {...props}
                            className="w-16 h-16 text-2xl text-center border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            style={{ width: "3rem", height: "3rem", margin: "0 4px" }}
                        />
                    )}
                />

                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white p-3 rounded-lg mt-6 hover:bg-blue-700 transition duration-200"
                >
                    Submit
                </button>
            </div>
        </div>

    );
};

export default OTP;
