const mongoose = require('mongoose');

const annonceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    gender: { type: String, required: true },
    datePublication: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    images: { 
        type: [String], // Tableau de chaînes (URLs d'images)
        validate: {
            validator: function(arr) {
                return arr.length >= 1 && arr.length <= 3; // Minimum 1, Maximum 3
            },
            message: "Une annonce doit contenir entre 1 et 3 images."
        },
        required: true // Oblige à avoir au moins une image
    }
});

const Annonce = mongoose.model('Annonce', annonceSchema);
module.exports = Annonce;