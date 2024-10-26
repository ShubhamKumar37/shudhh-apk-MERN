const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const cloudinaryConnection = () => {
    try {
        cloudinary.config(
            {
                cloud_name: process.env.CLOUD_NAME,
                api_key: process.env.API_KEY,
                api_secret: process.env.API_SECRET
            }
        );
    }
    catch (Error) {
        console.log("Connection with cloudinary is failed");
        console.log(Error);
    }
}

module.exports = cloudinaryConnection;