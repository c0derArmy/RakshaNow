const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, default: null },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    default: null
  },
  email: { type: String, unique: true, lowercase: true, sparse: true, default: null },
  password: { type: String, default: null },
  googleId: { type: String, default: null },
  profilePic: { type: String, default: null },
  role: { type: String, enum: ['CITIZEN', 'RESPONDER'], default: 'CITIZEN' },
  location: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
    lastUpdated: { type: Date, default: null },
    isLive: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);