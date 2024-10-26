const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    tag: [{ type: String }],
});

module.exports = mongoose.models.Media || mongoose.model('Media', mediaSchema);
