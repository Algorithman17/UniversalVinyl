const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    members: {
        type: [String],
        required: true,
        validate: [arrayLimit, 'Une conversation doit avoir au moins deux membres.']
    },
    annonceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Annonce',
        required: true
    },
    lastMessage: {
        type: String,
        default: ""
    },
    messages: {
        type: [{
            sender: { type: String, required: true },
            message: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }],
        default: []
    }
}, { timestamps: true });

function arrayLimit(val) {
    return val.length >= 2;
}

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;