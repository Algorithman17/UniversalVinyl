const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  zip: String,
  country: String
});

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  username: String,
  first: String,
  last: String,
  avatar: String,
  age: Number,
  genre_preferences: [String],
  bio: String,
  isPremiumMember: { type: Boolean, default: true },
  address: addressSchema
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;