const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { 
    type: String, 
    unique: true, 
    sparse: true,
    required: function() { return !this.googleId; }
  },
  email: { type: String, unique: true, lowercase: true, sparse: true },
  password: { 
    type: String, 
    required: function() { return !this.googleId; }
  },
  googleId: { type: String, unique: true, sparse: true },
  profilePic: { type: String },
  role: { type: String, enum: ['CITIZEN', 'RESPONDER'], default: 'CITIZEN' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);