const mongoose = require('mongoose');

const annonceSchema = new mongoose.Schema({
    title: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 1000 },
    price: { type: Number, required: true, min: 0 },
    musicStyle: { type: String, required: true, enum: ['rock', 'pop', 'rap', 'jazz', 'classique', 'electro', 'reggae', 'metal', 'blues', 'variété'] },
    images: [{
        imageUrl: { type: String, required: true },
        publicId: { type: String, required: true }   // Identifiant Cloudinary pour suppression
    }],
    createdAt: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Annonce = mongoose.model('Annonce', annonceSchema);
module.exports = Annonce;