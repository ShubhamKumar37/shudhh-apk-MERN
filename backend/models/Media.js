const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    type: { type: String, required: true , enum: ["image", "video"]},
});

module.exports = mongoose.models.Media || mongoose.model('Media', mediaSchema);
