const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  username: { type: String, required: true, unique: true },
  first: { type: String, required: true },
  last: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  birthday: { type: Date, required: true },
  bio: { type: String, default: '' },
  address: {
    number: { type: Number, required: true },
    street: { type: String, required: true },
    zip: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true }
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;