const Comment = require('../models/comment');


const fetchCommentsAll = async (req, res) => {
    const { id } = req.params;

    try {
        const comments = await Comment.find({ problemId: id }).populate('userId', 'firstName emailId').sort({ createdAt: -1 });
        if (comments.length === 0) {
            return res.status(404).json({
                message: "No comments found for this problem",
                comments: []
            })
        }
        res.status(200).json({
            comments: comments,
            message: "Comments fetched successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Error fetching comments"
        })
    }
}

const mongoose = require("mongoose");

const postComment = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.result._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid problemId"
        });
    }

    if (!content || !content.trim()) {
        return res.status(400).json({
            success: false,
            message: "Comment cannot be empty"
        });
    }

    try {
        await Comment.create({
            problemId: id,
            userId,
            content: content.trim()
        });

        res.status(201).json({
            success: true,
            message: "Comment posted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error posting comment"
        });
    }
};

module.exports = { fetchCommentsAll, postComment };