// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ForgotPassword, Home, Login, NotFound, OTP, ResetPassword, Signup } from './Pages';
import { AppDownload, Navbar } from './components';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { getAllApp } from './services/operations/appAPI';


const App = () => {

    const dispatch = useDispatch();
  
    useEffect(() =>
      {
        console.log("Aya hun app vala ka lia");
        dispatch(getAllApp());
      }, []);
  

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
                <Route path="/get-app/:appId" element={<AppDownload />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
        </Router>

    );
};

export default App;
