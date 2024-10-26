const mongoose = require('mongoose');

const commentReviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    app: { type: mongoose.Schema.Types.ObjectId, ref: 'App', required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
});

module.exports = mongoose.models.CommentReview || mongoose.model('CommentReview', commentReviewSchema);
