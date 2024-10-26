const User = require("../models/User");
const OTP = require("../models/OTP");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../template/otpTemplate");
const otpGenerater = require("otp-generator");

exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
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

        const otpEntry = await OTP.create({ email, otp });

        const mailResponse = await mailSender("OTP for your Signup", email, otpTemplate(otp));

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
        const { name, email, password, confirmPassword, otp } = req.body;

        if (!name || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "Password doesnot match with confirm password",
            });
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(401).json({
                success: false,
                message: "Email already exist try login"
            });
        }

        const otpExist = await OTP.findOne({ email, otp }).sort({ createdAt: -1 });
        if (!otpExist) {
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
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
        });

        return res.status(200).json({
            success: true,
            message: "Entry created successfully",
            data: userEntry
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            additionalInfo: "Error occur in while signup"
        });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(404).json({
                success: false,
                message: "All field are required"
            });
        }

        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userExist.password);
        if (!isPasswordCorrect) {
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

        return res.status(200).json({
            success: true,
            message: "User Logged in successfully",
            token,
            userExist
        });

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            additionalInfo: "Error occur in while login"
        });
    }
}

