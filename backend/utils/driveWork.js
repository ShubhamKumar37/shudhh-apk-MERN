const fs = require("fs");
const { configureGoogleDrive } = require("../config/googleDrive");

async function uploadFileToDrive(file, folderId = "1NYtXOCFw15O4ZtxHdesIMR3Nkt6UqzSV") {
    console.log("Starting file upload to Google Drive...");

    try {
        console.log("Configuring Google Drive...");

        const drive = await configureGoogleDrive();

        console.log("Configured Google Drive, preparing file metadata:", file.name);

        const fileMetaData = {
            name: file.name,
            parents: [folderId]
        };

        console.log("Preparing file metadata:", fileMetaData);

        const response = await drive.files.create({
            resource: fileMetaData,
            media: {
                body: fs.createReadStream(file.tempFilePath),
                mimeType: file.mimetype
            },
            fields: 'id, name, mimeType'
        });

        console.log("File uploaded successfully, getting file data...");

        const fileData = {
            googleDriveFileId: response.data.id,
            fileName: response.data.name,
            fileType: response.data.mimeType,
            fileUrl: `https://drive.google.com/file/d/${response.data.id}/view`,
        };

        console.log("File uploaded successfully:", fileData);

        return fileData;

    } catch (error) {
        console.error("Error uploading file to Google Drive:", error);
        throw error;
    }
}

async function deleteFileFromDrive(googleDriveFileId) {
    try {
        console.log("Configuring Google Drive...");

        const drive = await configureGoogleDrive();

        console.log("Deleting file from Google Drive:", googleDriveFileId);

        await drive.files.delete({
            fileId: googleDriveFileId
        });

        console.log("File deleted successfully from Google Drive:", googleDriveFileId);
        return { success: true, message: "File successfully deleted from Google Drive", googleDriveFileId };

    } catch (error) {
        console.error("Error deleting file from Google Drive:", error);
        throw error;
    }
}

async function updateFileOnDrive(googleDriveFileId, newFile) {
    try {
        console.log("Configuring Google Drive...");

        const drive = await configureGoogleDrive();

        const updateOptions = {
            fileId: googleDriveFileId,
            fields: 'id, name, mimeType',
            resource: {
                name: newFile.name
            }
        };

        console.log("This is the file name ======> ", newFile.name);

        if (newFile) {
            updateOptions.media = {
                body: fs.createReadStream(newFile.tempFilePath),
                mimeType: newFile.mimetype
            };
        }

        console.log("Updating file on Google Drive:", googleDriveFileId);

        const response = await drive.files.update(updateOptions);

        console.log("File updated successfully on Google Drive, getting file data...");

        const updatedFileData = {
            googleDriveFileId: response.data.id,
            fileName: newFile.name,
            fileType: newFile.mimetype,
            fileUrl: `https://drive.google.com/file/d/${response.data.id}/view`
        };

        console.log("File updated successfully on Google Drive:", updatedFileData);
        return updatedFileData;

    } catch (error) {
        console.error("Error updating file on Google Drive:", error);
        throw error;
    }
}

module.exports = { uploadFileToDrive, deleteFileFromDrive, updateFileOnDrive };