import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="flex h-screen justify-center items-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold">404</h1>
                <p className="text-2xl">Page Not Found</p>
                <button className="mt-10 px-4 py-2 bg-blue-500 text-white rounded-md" onClick={() => navigate('/')}>
                    Go to Home
                </button>
            </div>
        </div>
    );
};

export default NotFound;
