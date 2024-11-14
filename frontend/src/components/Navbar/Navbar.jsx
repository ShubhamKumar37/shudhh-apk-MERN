// src/components/Navbar.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/operations/authAPI';

const Navbar = () => {

    const token = useSelector((state) => state.auth.token) || JSON.parse(localStorage.getItem("token"));
    const userData = useSelector((state) => state.auth.userData) || JSON.parse(localStorage.getItem("userData"));
    console.log("This is user data", userData);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    return (
        <nav className="bg-blue-600 py-3 px-[3rem] flex justify-between items-center">
            <Link to="/" className="text-white font-bold text-xl">
                App Store
            </Link>
            <div className='flex gap-5 items-center'>
                {/* Conditional Rendering for Logout and User Profile */}
                {token && (
                    <button
                        className="text-white px-4 py-2 mr-2 bg-blue-700 rounded hover:bg-blue-800 transition duration-300"
                        onClick={() => dispatch(logout(navigate))}
                    >
                        Logout
                    </button>
                )}
                {token && (
                    <Link to="/dashboard" className="text-white rounded hover:bg-blue-700 p-2 transition duration-300">
                        <div>
                            <img
                                src={userData?.profilePicture}
                                alt="Avatar"
                                className="w-12 h-12 border-2 border-blue-700 rounded-full"
                            />
                        </div>
                    </Link>
                )}

                {/* Conditional Rendering for Login and Signup */}
                {!token && (
                    <Link
                        to="/login"
                        className="text-white px-4 py-2 mr-2 bg-blue-700 rounded hover:bg-blue-800 transition duration-300"
                    >
                        Login
                    </Link>
                )}
                {!token && (
                    <Link
                        to="/signup"
                        className="text-white px-4 py-2 bg-blue-700 rounded hover:bg-blue-800 transition duration-300"
                    >
                        Sign Up
                    </Link>
                )}
            </div>
        </nav>

    );
};

export default Navbar;
