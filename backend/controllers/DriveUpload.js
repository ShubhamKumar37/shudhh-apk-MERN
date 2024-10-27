const { uploadFileToDrive, deleteFileFromDrive, updateFileOnDrive } = require('../utils/driveWork');
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
            fileUrl: fileData.fileUrl
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

exports.deleteMainFile = async (req, res) =>
{
    try
    {
        const { googleDriveFileId } = req.body;

        if (!googleDriveFileId) {
            console.log("No Google Drive file ID provided.");
            return res.status(400).json({ message: 'No Google Drive file ID provided.' });
        }

        const fileData = await AppMedia.findOne({ googleDriveFileId: googleDriveFileId });

        if (!fileData) {
            console.log("File not found in MongoDB.");
            return res.status(404).json({ message: 'File not found.' });
        }

        const deletedFileData = await deleteFileFromDrive(googleDriveFileId);

        if (!deletedFileData) {
            console.log("Error deleting file from Google Drive.");
            return res.status(500).json({ message: 'Error deleting file from Google Drive.' });
        }

        await AppMedia.deleteOne({ googleDriveFileId: googleDriveFileId });
        console.log("File deleted from MongoDB.");
        return res.status(200).json(
            {
                success: true,
                message: "File deleted successfully",
                data: deletedFileData
            }
        );
    }
    catch(error)
    {
        console.error("Error deleting file:", error);
        return res.status(500).json(
            {
                success: false,
                message: error.message,
                additonalInfo: "Error deleting file"
            }
        );
    }
}

exports.updateMainFile = async (req, res) =>
{
    try
    {
        const { googleDriveFileId } = req.body;
        const file  = req?.files?.file;
        console.log("Received request to update main file.", file);

        if (!googleDriveFileId) {
            console.log("No Google Drive file ID provided.");
            return res.status(400).json({ message: 'No Google Drive file ID provided.' });
        }

        if (!file) {
            console.log("No file uploaded.");
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const fileExist = await AppMedia.findOne({ googleDriveFileId: googleDriveFileId });
        
        if (!fileExist) {
            console.log("File not found in MongoDB.");
            return res.status(404).json({ message: 'File not found.' });
        }
        
        const updatedFileData = await updateFileOnDrive(googleDriveFileId, file);

        fileExist.fileName = updatedFileData.fileName;
        fileExist.fileType = updatedFileData.fileType;

        await fileExist.save();

        return res.status(200).json(
            {
                success: true,
                message: "File updated successfully",
                data: updatedFileData
            }
        );


    }
    catch(error)
    {
        console.error("Error updating file:", error);
        return res.status(500).json(
            {
                success: false,
                message: error.message,
                additonalInfo: "Error updating file"
            }
        );
    }
}