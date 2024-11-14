const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    publicId: { type: String },
    phoneNumber: { type: String},
    address: { type: String },
    profilePicture: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' },
    token: { type: String },
    totalAppDownload: { type: Number, default: 0 },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
    gender: { type: String, enum: ["Male", "Female"] },
    resetPasswordExpiry: { type: Date },
    appProvided: [{ type: mongoose.Schema.Types.ObjectId, ref: 'App' }],
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
