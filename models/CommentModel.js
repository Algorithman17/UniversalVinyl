const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    annonceId: String,
    buyer: {
        username: String,
        messages: [{
            message: String,
            createdAt: { type: Date, default: Date.now() }
        }]
    },
    seller: {
        username: String,
        messages: [{
            message: String,
            createdAt: { type: Date, default: Date.now() }
        }]
    }
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;