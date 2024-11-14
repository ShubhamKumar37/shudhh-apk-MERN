const User = require("../models/User");
const OTP = require("../models/OTP");
const Media = require("../models/Media");
const mailSender = require("../utils/mailSender");
const { otpTemplate } = require("../template/otpTemplate");
const { resetPasswordTemplate } = require('../template/resetPassword');
const otpGenerater = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { updateFileCloudinary, uploadToCloudinary } = require("../utils/cloudinaryWork");

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
        const { name, email, password, confirmPassword, otp, phoneNumber } = req.body;

        // Ensure all required fields are provided
        if (!name || !email || !password || !confirmPassword || !otp) {
            console.log("All fields are required");
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check password and confirm password match
        if (password !== confirmPassword) {
            console.log("Password does not match with confirm password");
            return res.status(403).json({
                success: false,
                message: "Password does not match with confirm password",
            });
        }

        // Check if the email already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            console.log("Email already exists. Try logging in.");
            return res.status(401).json({
                success: false,
                message: "Email already exists. Try logging in",
            });
        }

        // Check if the OTP is valid
        const otpExist = await OTP.findOne({ email, otp }).sort({ createdAt: -1 });
        if (!otpExist) {
            console.log("OTP does not exist");
            return res.status(400).json({
                success: false,
                message: "OTP does not exist",
            });
        }

        // If phoneNumber is provided, validate uniqueness
        if (phoneNumber) {
            const phoneNumberExist = await User.findOne({ phoneNumber });
            if (phoneNumberExist) {
                console.log("Phone number already exists");
                return res.status(400).json({
                    success: false,
                    message: "Phone number already exists. Try using another.",
                });
            }
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user entry
        const userEntry = await User.create({
            name,
            email,
            password: hashedPassword,
            phoneNumber, // Optionally include phoneNumber if provided
        });

        console.log("User entry in signUp: ", userEntry);

        return res.status(200).json({
            success: true,
            message: "User created successfully",
            data: userEntry,
        });
    } catch (error) {
        console.error("Error occurred while signing up: ", error);
        return res.status(500).json({
            success: false,
            message: error.message,
            additionalInfo: "Error occurred while signing up",
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

        const userExist = await User.findOne({ email }).populate("profilePicture");
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

exports.resetPasswordToken = async (req, res) => {
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
            { token: token, resetPasswordExpires: Date.now() + 20 * 60 * 1000 }, { new: true }
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
        // await mailSender("Your password successfully changed", updatedUser.email, "<h1>Your password is changed</h1>")

        return res.status(200).json(
            {
                success: true,
                message: "Password updated successfully",
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

exports.updateUser = async (req, res) => {
    try {
        const userId = req.user.id;  // Assuming the userId is coming from the authenticated user's token
        const userExist = await User.findById(userId);

        if (!userExist) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Destructure fields from req.body and files
        const { name, phoneNumber, address, publicId } = req.body;
        const profilePicture = req.files?.profilePicture;
        console.log("This is req.files = ", req.files);

        const updateData = {};

        // Only update fields if they are present
        if (name) updateData.name = name;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        if (address) updateData.address = address;

        // If no profile picture is provided, keep the current one
        // if (!profilePicture) {
        //     updateData.profilePicture = userExist.profilePicture;
        // }

        // If no data to update (excluding profile picture), return an error
        if (Object.keys(updateData).length === 0 && !profilePicture) {
            return res.status(400).json({
                success: false,
                message: "No data to update"
            });
        }

        let response;
        
        // Handle profile picture upload

        console.log("Eder toh paka aya");
        if (profilePicture) {
            console.log("Yaba toh paka aya hun");
            if (!publicId) {
                // If no publicId is provided, upload a new profile picture
                response = await uploadToCloudinary(profilePicture);  // Assuming uploadToCloudinary handles file upload
                console.log("Without publicid => ", response);
                // Create a new media record for the uploaded image
                const media = await Media.create({
                    url: response.secure_url,
                    publicId: response.public_id,
                    type: response?.resource_type?.split("/")[0],  // Assuming it's always an image. Modify if necessary for other media types
                });

                // Add the new profile picture data to the update
                updateData.profilePicture = media._id;
            } else {
                // If publicId exists, update the existing profile picture
                    console.log("with publicid");
                response = await updateFileCloudinary(profilePicture, publicId)
                console.log("Yaa aya hun " ,response);
                // updateData.profilePicture = response.secure_url;
                // updateData.publicId = response.public_id;
                const updateMedia = await Media.findOneAndUpdate({ publicId: publicId }, { url: response.secure_url, publicId: response.public_id, type: response?.resource_type?.split("/")[0] }, { new: true });
            }
        }


        // Update the user's document in the database with the new data
        console.log("This is update user = ", updateData);
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { ...userExist.toObject(), ...updateData, profilePicture: updateData.profilePicture },  // Merge the existing data with the updated fields
            { new: true }
        ).populate("profilePicture");
        console.log("Updated user: ", updatedUser);

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
            additionalInfo: updateData
        });

    } catch (error) {
        console.log("Error in updating user: ", error);
        return res.status(500).json({
            success: false,
            message: error.message,
            additionalInfo: "Error in updating user"
        });
    }
}
