const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    members: {
        type: Array
    },
    annonceId: {
        type: String
    }
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;