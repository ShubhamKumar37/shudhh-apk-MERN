// src/components/Navbar.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Navbar = () => {

    const token = useSelector((state) => state.auth.token);

    return (
        <nav className="bg-blue-600 p-4 flex justify-between items-center">
            <Link to="/" className="text-white font-bold text-xl">App Store</Link>
            <div>
                {token && <Link to="/dashboard" className="text-white px-4 py-2 mr-2 bg-blue-700 rounded">
                        <div>
                        
                    </div>
                </Link>}

                {!token && <Link to="/login" className="text-white px-4 py-2 mr-2 bg-blue-700 rounded">Login</Link>}
                {!token && <Link to="/signup" className="text-white px-4 py-2 bg-blue-700 rounded">Sign Up</Link>}
            </div>
        </nav>
    );
};

export default Navbar;
