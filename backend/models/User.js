const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String},
    token: { type: String },
    publicId: { type: String },
    totalAppDownload: { type: Number, default: 0 },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
    phoneNumber: { type: String},
    birthday: { type: Date },
    gender: { type: String, enum: ["Male", "Female"] },
    resetPasswordExpiry: { type: Date },
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
