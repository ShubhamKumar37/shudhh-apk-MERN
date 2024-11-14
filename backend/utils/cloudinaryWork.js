// Working
const cloudinary = require("cloudinary").v2;

// Upload file to Cloudinary
exports.uploadToCloudinary = async (file, folder = "media", quality, height) => {
    try {
        console.log("Inside uploadToCloudinary function");
        const options = { folder, resource_type: "auto" };

        if (height) options.height = height;
        if (quality) options.quality = quality;

        console.log("Options for upload:", options);
        return await cloudinary.uploader.upload(file.tempFilePath, options);
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw error;
    }
};

// Update file on Cloudinary
exports.updateFileCloudinary = async (file, publicId, resourceType = "auto", quality) => {
    try {
        console.log("Inside updateFileCloudinary function");
        const options = {
            overwrite: true,
            public_id: publicId,
            resource_type: resourceType
        };

        if (quality) options.quality = quality;

        console.log("Options for update:", options);
        return await cloudinary.uploader.upload(file.tempFilePath, options);
    } catch (error) {
        console.error("Error updating file on Cloudinary:", error);
        throw error;
    }
};

// Delete file from Cloudinary
exports.deleteFileCloudinary = async (publicId, resourceType = "auto") => {
    try {
        console.log("Inside deleteFileCloudinary function");
        const options = { resource_type: resourceType };

        const response = await cloudinary.uploader.destroy(publicId, options);
        console.log("Delete response:", response);
        return response;
    } catch (error) {
        console.error("Error deleting file from Cloudinary:", error);
        throw error;
    }
};
