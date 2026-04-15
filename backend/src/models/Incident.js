const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['MEDICAL', 'FIRE', 'POLICE', 'UNKNOWN'] },
  location: { lat: Number, lng: Number },
  transcript: { type: String },
  status: { type: String, default: 'ACTIVE' },
  reportedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Incident', incidentSchema);