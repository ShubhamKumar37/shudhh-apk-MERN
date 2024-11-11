// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ForgotPassword, Home, Login, OTP, ResetPassword, Signup } from './Pages';
import { Navbar } from './components';
import { Toaster } from 'react-hot-toast';


const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/otp" element={<OTP />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/update-password/:id" element={<ResetPassword />} />
            </Routes>
            <Toaster />
        </Router>

    );
};

export default App;
