const mongoose = require('mongoose');

const annonceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  musicStyle: { type: String, required: true },
  images: [{ name: String,
    contentType: String,
    imageUrl: String 
  }],
  createdAt: { type: Date, default: Date.now },
  userId: { type: String },
});

const Annonce = mongoose.model('Annonce', annonceSchema);
module.exports = Annonce;