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
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  username: String,
  first: String,
  last: String,
  avatar: String,
  age: Number,
  genre_preferences: [String],
  bio: String,
  address: addressSchema
});

const User = mongoose.model('User', userSchema);

module.exports = User;