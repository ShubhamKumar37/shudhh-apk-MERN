const { uploadFileToDrive } = require('../utils/driveWork');
const AppMedia = require('../models/AppMedia');

exports.uploadMainFile = async (req, res) => {
    try {
        console.log("Received request to upload main file.");

        const file = req.files?.file;

        if (!file) {
            console.log("No file uploaded.");
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        console.log("Uploading file to Google Drive...");
        const fileData = await uploadFileToDrive(file);
        console.log("File uploaded to Google Drive:", fileData);

        const appMedia = new AppMedia({
            googleDriveFileId: fileData.googleDriveFileId,
            fileName: fileData.fileName,
            fileType: fileData.fileType,
            fileSize: file?.size,
        });

        const savedAppMedia = await appMedia.save();
        console.log("File metadata saved to MongoDB:", savedAppMedia);

        console.log("Sending success response back to client.");
        return res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            data: { savedAppMedia, fileData }
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: error.message });
    }
};

