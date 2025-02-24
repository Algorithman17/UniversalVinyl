const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  username: String,
  first: String,
  last: String,
  avatar: String,
  birthday: String,
  bio: String,
  address: {
    number: Number,
    street: String,
    zip: String,
    city: String,
    country: String
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;