const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, default: 'Emergency Alert' }, 
  type: { type: String, default: 'UNKNOWN' },
  location: { 
    lat: Number, 
    lng: Number, 
    address: String 
  },
  landmark: { type: String },
  transcript: { type: String }, // Can be used for detailed description
  desc: { type: String }, // Shorter summary for UI
  status: { type: String, enum: ['CRITICAL', 'DISPATCHED', 'RESOLVED', 'ACTIVE'], default: 'CRITICAL' },
  reportedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Incident', incidentSchema);