const mongoose = require('mongoose');

const appMediaSchema = new mongoose.Schema({
    app: { type: mongoose.Schema.Types.ObjectId, ref: 'App', required: true },
    googleDriveFileId: { type: String, required: true }, // Google Drive File ID which is going to be used for CRUD operation
    fileName: { type: String, required: true }, // Name of the file in Google Drive
    fileType: { type: String, required: true }, // MIME type of the file
    fileSize: { type: Number }, // Size of the file in bytes, we are getting this from frontend not from googledrive
    createdAt: { type: Date, default: Date.now }, // When the file was uploaded
    updatedAt: { type: Date, default: Date.now }, // When the file was last updated
    fileUrl: { type: String, required: true }, // URL which is going to be used to create blob object for download
});

module.exports = mongoose.models.AppMedia || mongoose.model('AppMedia', appMediaSchema);
