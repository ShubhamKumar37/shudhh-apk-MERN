const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
    token: { type: String },
    publicId: { type: String }, // For Cloudinary image uploads
    totalAppDownload: { type: Number, default: 0 },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
    phoneNumber: { type: String, unique: true },
    birthday: { type: Date },
    gender: { type: String, enum: ["Male", "Female"] },
    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: Date },
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
