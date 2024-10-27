const User = require("../models/User");
const OTP = require("../models/OTP");
const mailSender = require("../utils/mailSender");
const {otpTemplate} = require("../template/otpTemplate");
const { resetPasswordTemplate } = require('../template/resetPassword');
const otpGenerater = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.sendOTP = async (req, res) => {
    try {
        console.log("Request body in sendOTP: ", req.body);
        const { email } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log("User already exists");
            return res.status(401).json({
                success: false,
                message: "User already exists"
            });
        }

        let otp;
        const existingOTPs = new Set();

        while (true) {
            otp = otpGenerater.generate(6, {
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false,
            });

            if (!existingOTPs.has(otp)) {
                const checkExistOTP = await OTP.findOne({ otp });
                if (!checkExistOTP) {
                    break;
                }
            }

            existingOTPs.add(otp);
        }

        console.log("Generated OTP: ", otp);

        const otpEntry = await OTP.create({ email, otp });

        const mailResponse = await mailSender("OTP for your Signup", email, otpTemplate(otp));

        console.log("Mail response in sendOTP: ", mailResponse);

        return res.status(200).json({
            success: true,
            message: "OTP created successfully, check your spam folder",
            data: { otpEntry, mailResponse }
        });
    } catch (error) {
        console.error("Error while sending OTP:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while sending OTP",
            additionalInfo: error.message
        });
    }
}


exports.signUp = async (req, res) => {
    try {
        console.log("Request body in signUp: ", req.body);
        const { name, email, password, confirmPassword, otp } = req.body;

        if (!name || !email || !password || !confirmPassword || !otp) {
            console.log("All fields are required");
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (password !== confirmPassword) {
            console.log("Password doesnot match with confirm password");
            return res.status(403).json({
                success: false,
                message: "Password doesnot match with confirm password",
            });
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            console.log("Email already exist try login");
            return res.status(401).json({
                success: false,
                message: "Email already exist try login"
            });
        }

        const otpExist = await OTP.findOne({ email, otp }).sort({ createdAt: -1 });
        if (!otpExist) {
            console.log("OTP doesnot exist");
            return res.status(400).json({
                success: false,
                message: "OTP doesnot exist"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userEntry = await User.create({
            name,
            email,
            password: hashedPassword,
            profilePicture: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
        });

        console.log("User entry in signUp: ", userEntry);

        return res.status(200).json({
            success: true,
            message: "Entry created successfully",
            data: userEntry
        });
    } catch (error) {
        console.error("Error occur in while signup: ", error);
        return res.status(500).json({
            success: false,
            message: error.message,
            additionalInfo: "Error occur in while signup"
        });
    }
}

exports.login = async (req, res) => {
    try {
        console.log("Request body in login: ", req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            console.log("All field are required");
            return res.status(404).json({
                success: false,
                message: "All field are required"
            });
        }

        const userExist = await User.findOne({ email });
        if (!userExist) {
            console.log("User not found");
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userExist.password);
        if (!isPasswordCorrect) {
            console.log("Password is incorrect");
            return res.status(400).json({
                success: false,
                message: "Password is incorrect"
            });
        }

        const token = jwt.sign({ email: userExist.email, id: userExist._id }, process.env.JWT_SECRET, { expiresIn: "10h" });
        userExist.token = token;
        userExist.password = undefined;

        const options = {
            httpOnly: true,
            maxAge: Date.now() + 3 * 24 * 60 * 60 * 1000
        }

        res.cookie("token", token, options);

        console.log("User logged in successfully");

        return res.status(200).json({
            success: true,
            message: "User Logged in successfully",
            token,
            userExist
        });

    }
    catch (error) {
        console.error("Error occur in while login: ", error);
        return res.status(500).json({
            success: false,
            message: error.message,
            additionalInfo: "Error occur in while login"
        });
    }
}


exports.resetPasswordToken = async (req, res) => 
{
    try {
        // Take email from req body
        const email = req.body.email;

        // Existance of user
        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(401).json(
                {
                    success: false,
                    message: `This ${email} doesnot exist in database`
                }
            );
        }

        // Generate Token
        const token = crypto.randomUUID();

        const updatedDetails = await User.findOneAndUpdate({ email: email },
            { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 }, { new: true }
        );

        // Create URL for reset Password
        const url = `http://localhost:3000/update-password/${token}`;

        // Send mail of rest password url
        
        await mailSender("Password Reset Request", email, resetPasswordTemplate(url));

        return res.status(200).json(
            {
                success: true,
                message: "A reset password link is sended to your email",
                data: updatedDetails
            }
        );
    }
    catch (Error) {
        return res.status(500).json(
            {
                success: false,
                message: Error.message,
                additionalInfo: "Error while creating reset password token (ResetPassword.js)"
            }
        );
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;

        // Validation of extracted data
        if (!password || !confirmPassword || !token) {
            return res.status(401).json(
                {
                    success: false,
                    message: "All field are required"
                }
            );
        }

        if (password !== confirmPassword) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Password is not matching with confirm password"
                }
            );
        }

        // Find user and vaildate the token expire time
        const userExist = await User.findOne({ token: token });

        if (!userExist) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Your token is invalid"
                }
            );
        }

        if (userExist.resetPasswordExpiry < Date.now()) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Your token/link is expired for reseting the password"
                }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await User.findOneAndUpdate({ token: token },
            { password: hashedPassword }, { new: true },
        );

        // Send a mail of confirm changed password
        await mailSender("Your password successfully changed", updatedUser.email, "<h1>Your password is changed</h1>")

        return res.status(200).json(
            {
                success: true,
                message: "Password resetted successfully",
                data: updatedUser
            }
        );
    }
    catch (Error) {
        return res.status(500).json(
            {
                success: false,
                message: Error.message,
                additionalInfo: "Error while resetting password (Auth.js)"
            }
        );
    }
}