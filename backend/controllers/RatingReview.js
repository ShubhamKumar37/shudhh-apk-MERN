const CommentReview = require('../models/RatingReview');


exports.createCommentReview = async (req, res) => {
    try
    {
        const userId = req.user._id;
        const {appId, comment, rating} = req.body;

        if(!appId || !comment || !rating)
        {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if(rating < 1 && rating > 5)
        {
            return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
        }

        const newCommentReview = await CommentReview.create({ user: userId, app: appId, comment, rating });

        return res.status(201).json({ success: true, message: "Comment review created successfully", data: newCommentReview });
    }
    catch(error)
    {
        console.log("Error in creating comment review: ", error);
        return res.status(500).json({ success: false, message: error.message, additionalInfo: "Error in creating comment review" });
    }
}

exports.updateCommentReview = async (req, res) => 
{
    try
    {
        const {commentId, comment, rating} = req.body;
        const updateOptions = {};

        if(comment) updateOptions.comment = comment;
        if(rating) updateOptions.rating = rating;

        if(!commentId)
        {
            return res.status(400).json({ success: false, message: "Comment ID is required" });
        }

        if(rating && rating < 1 && rating > 5)
        {
            return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
        }

        const commentExist = await CommentReview.findByIdAndUpdate({ _id: commentId }, updateOptions, { new: true });
        if(!commentExist)
        {
            return res.status(404).json({ success: false, message: "Comment review not found" });
        }

        return res.status(200).json({ success: true, message: "Comment review updated successfully", data: commentExist });

    }
    catch(error)
    {
        console.log("Error in updating comment review: ", error);
        return res.status(500).json({ success: false, message: error.message, additionalInfo: "Error in updating comment review" });
    }
}

exports.deleteCommentReview = async (req, res) =>
{
    try
    {
        const {commentId, appId} = req.body;

        if(!commentId)
        {
            return res.status(400).json({ success: false, message: "Comment ID is required" });
        }

        if(!appId)
        {
            return res.status(400).json({ success: false, message: "App ID is required" });
        }

        const appExist = await App.findByIdAndUpdate({app : appId}, { $pull: { comments: commentId } }, { new: true });
        if(!appExist)
        {
            return res.status(404).json({ success: false, message: "App not found" });
        }

        const commentExist = await CommentReview.findByIdAndDelete({ _id: commentId });
        if(!commentExist)
        {
            return res.status(404).json({ success: false, message: "Comment review not found" });
        }

        return res.status(200).json({ success: true, message: "Comment review deleted successfully", data: commentExist });
    }
    catch(error)
    {
        console.log("Error in deleting comment review: ", error);
        return res.status(500).json({ success: false, message: error.message, additionalInfo: "Error in deleting comment review" });
    }
}

exports.getAllCommentReview = async (req, res) =>
{
    try
    {
        const commentReview = await CommentReview.find().populate('user').populate('app');
        return res.status(200).json({ success: true, message: "Comment review fetched successfully", data: commentReview });
    }
    catch(error)
    {
        console.log("Error in getting all comment review: ", error);
        return res.status(500).json({ success: false, message: error.message, additionalInfo: "Error in getting all comment review" });
    }
}

exports.getAppAllCommentReview = async (req, res) =>
{
    try
    {
        const appId = req.params.appId;
        const commentReview = await CommentReview.find({ app: appId }).populate('user').populate('app');
        return res.status(200).json({ success: true, message: "Comment review fetched successfully", data: commentReview });
    }
    catch(error)
    {
        console.log("Error in getting app all comment review: ", error);
        return res.status(500).json({ success: false, message: error.message, additionalInfo: "Error in getting app all comment review" });
    }
}