const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
    appName: { type: String, required: true },
    appDescription: { type: String, required: true },
    companyName: { type: String },
    media: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AppMedia' }],
    tag: [{ type: String }],
    size: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    download: { type: Number, default: 0 },
    releaseDate: { type: Date },
    systemRequirement: { type: String },
    language: [{ type: String }],
    rating: { type: Number, default: 0 },
    comment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CommentReview' }],
    appPermission: [{ type: String }],
    inAppPurchase: { type: Boolean, default: false },
    appLink: { type: String },
    searchKeywords: [{ type: String }], // Keywords for search optimization
});

module.exports = mongoose.models.App || mongoose.model('App', appSchema);
