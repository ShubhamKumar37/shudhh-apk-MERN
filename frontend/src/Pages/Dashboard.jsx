import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Dashboard = () => {

    const { userData } = useSelector((state) => state.auth);
    console.log("This userData = ", userData);

    return (
        <div className="bg-white min-h-screen flex items-center justify-center py-12 px-4">
            <div className="w-[40rem] p-[2rem] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center  ">
                <div className="bg-white w-[90%] p-8 rounded-2xl shadow-lg lg:w-1/2 lg:flex lg:flex-col lg:items-center lg:justify-center">
                    <div className="flex flex-col items-center space-y-6">
                        <h2 className="text-3xl font-extrabold text-center">Dashboard</h2>

                        <div className="text-center">
                            <p className="text-lg">
                                Welcome, <span className="font-semibold">{userData?.name}</span>
                            </p>
                            <p className="mt-2 text-lg">
                                You have <span className="font-semibold">{userData?.appProvided?.length || 0}</span> apps
                            </p>
                            <p className="mt-2 text-lg">
                                Your Email: <span className="font-semibold">{userData?.email}</span>
                            </p>
                        </div>

                        <div className="mt-6">
                            <img
                                src={userData?.profilePicture}
                                className="w-32 h-32 rounded-full border-4 border-blue-600 shadow-lg transition-transform transform hover:scale-110"
                                alt={userData?.name}
                            />
                        </div>

                        <div className="mt-6">
                            <Link to="/update-user">
                                <button
                                    type="button"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Update Profile
                                </button>
                            </Link>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Dashboard


