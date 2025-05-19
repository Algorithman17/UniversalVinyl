const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ },
  password: { type: String, required: true, minlength: 8, match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/ },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  username: { type: String, required: true, unique: true },
  first: { type: String, required: true },
  last: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  avatarPublicId: { type: String, default: '' },
  birthday: { type: Date, required: true },
  bio: { type: String, default: '' },
  address: {
    number: { type: Number, required: true },
    street: { type: String, required: true },
    zip: { type: Number, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true }
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;