const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
    appName: { type: String, required: true },
    appDescription: { type: String, required: true },
    companyName: { type: String },
    appIcon: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' },
    appFile: { type: mongoose.Schema.Types.ObjectId, ref: 'AppMedia' },
    tag: [{ type: String }],
    size: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    download: { type: Number, default: 0 },
    releaseDate: { type: String },
    systemRequirement: { type: String },
    language: [{ type: String }],
    comment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CommentReview' }],
    appPermission: [{ type: String }],
    inAppPurchase: { type: Boolean, default: false },
    media: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
    searchKeywords: [{ type: String, default: [this.appName] }], // Keywords for search optimization
    providedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.models.App || mongoose.model('App', appSchema);
