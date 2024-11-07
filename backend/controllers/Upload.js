const Media = require("../models/Media");
const { uploadToCloudinary, deleteFileCloudinary, updateFileCloudinary } = require("../utils/cloudinaryWork");

exports.uploadFile = async (req, res) => {
    try {
        console.log("Request files in uploadFile: ", req.files);
        const {file} = req.files;

        if(!file) {
            return res.status(400).json({
                success: false,
                message: "Image or video is required"
            });
        }

        console.log("Uploading file to Cloudinary...");
        const uploadResponse = await uploadToCloudinary(file, "media", 90);

        console.log("Upload response from Cloudinary: ", uploadResponse);

        const mediaEntry = new Media({
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
            type: file.mimetype.split("/")[0],
        });

        await mediaEntry.save();

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


exports.deleteFile = async(req, res) => {
    try {
        const {publicId, resourceType = "image"} = req.body;

        if(!publicId) {
            return res.status(400).json({
                success: false,
                message: "Public id is required"
            });
        }

        const mediaEntry = await Media.findOneAndDelete({publicId});

        
        if(!mediaEntry) {
            return res.status(404).json({
                success: false,
                message: "Media not found"
            });
        }

        const response = await deleteFileCloudinary(publicId, resourceType);
        console.log("Delete response from Cloudinary: ", response);
        
        return res.status(200).json({
            success: true,
            message: "File deleted successfully",
            data: mediaEntry
        });
    } catch (error) {
        console.error("Error while deleting file: ", error);
        return res.status(500).json({
            success: false,
            message: error.message,
            additionalInfo: "Error while deleting file"
        });
    }
}

exports.updateFile = async(req, res) => {
    try {
        const {publicId} = req.body;
        const {file} = req.files;

        if(!file) {
            return res.status(400).json({
                success: false,
                message: "Image or video is required"
            });
        }
        if(!publicId) {
            return res.status(400).json({
                success: false,
                message: "Public id is required"
            });
        }

        const fileExist = await Media.findOne({publicId});
        if(!fileExist) {
            return res.status(404).json({
                success: false,
                message: "File not found"
            });
        }

        console.log("Updating file on Cloudinary: ", publicId);

        const updateResponse = await updateFileCloudinary(file, publicId);

        console.log("Update response from Cloudinary: ", updateResponse);

        return res.status(200).json({
            success: true,
            message: "File updated successfully",
            data: updateResponse
        });
    }
    catch(Error)
    {
        console.error("Error while updating file: ", Error);
        return res.status(500).json({
            success: false,
            message: Error.message,
            additionalInfo: "Error while updating file"
        });
    }
}
