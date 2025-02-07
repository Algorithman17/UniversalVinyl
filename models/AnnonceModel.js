const mongoose = require('mongoose');

const annonceSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    description: { type: String, required: true },
    prix: { type: Number, required: true },
    genre: { type: String, required: true },
    datePublication: { type: Date, default: Date.now },
    utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Annonce = mongoose.model('Annonce', annonceSchema);
module.exports = Annonce;