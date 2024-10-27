const Media = require("../models/Media");
const { uploadToCloudinary } = require("../utils/cloudinaryWork");

exports.uploadFile = async (req, res) => {
    try {
        console.log("Request files in uploadFile: ", req.files);
        const {image} = req.files;

        if(!image) {
            return res.status(400).json({
                success: false,
                message: "Image or video is required"
            });
        }

        console.log("Uploading file to Cloudinary...");
        const uploadResponse = await uploadToCloudinary(image, "media");

        console.log("Upload response from Cloudinary: ", uploadResponse);

        const mediaEntry = new Media({
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id
        });

        console.log("Creating new media entry: ", mediaEntry);

        return res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            data: mediaEntry
        });
    } catch (error) {
        console.error("Error while uploading file: ", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
