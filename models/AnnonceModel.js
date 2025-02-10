const mongoose = require('mongoose');

const annonceSchema = new mongoose.Schema({
    userId: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    musicStyle: { type: String, required: true },
    images: [{ name: String,
              contentType: String,
              image: Buffer, 
            }],
    createdAt: { type: Date, default: Date.now }
});

const Annonce = mongoose.model('Annonce', annonceSchema);
module.exports = Annonce;