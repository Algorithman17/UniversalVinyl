const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  zip: String,
  country: String
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: String,
  first: String,
  last: String,
  avatar: String,
  age: Number,
  genre_preferences: [String],
  favorite_books: [String],
  reading_history: [String],
  wishlist: [String],
  bio: String,
  isPremiumMember: { type: Boolean, default: false },
  address: addressSchema
});

const User = mongoose.model('User', userSchema);

module.exports = User;