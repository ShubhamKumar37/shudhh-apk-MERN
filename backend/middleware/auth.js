const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
    try {
        const token =
            req.body.token ||
            req.cookies.token ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = decoded;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: error.message,
                additionalInfo: "Token is invalid",
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            additionalInfo: "Error while authenticating user",
        });
    }
};

