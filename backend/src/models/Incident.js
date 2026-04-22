const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  title: { type: String, default: 'Emergency Alert' }, 
  type: { type: String, default: 'UNKNOWN' },
  location: { 
    lat: Number, 
    lng: Number, 
    address: String 
  },
  landmark: { type: String },
  transcript: { type: String },
  desc: { type: String },
  status: { type: String, enum: ['CRITICAL', 'PENDING', 'DISPATCHED', 'ASSIGNED', 'RESOLVED', 'ACTIVE'], default: 'CRITICAL', index: true },
  reportedAt: { type: Date, default: Date.now, index: true }
});

// Compound index for faster queries
incidentSchema.index({ reportedAt: -1 });
incidentSchema.index({ userId: 1, reportedAt: -1 });
incidentSchema.index({ status: 1, reportedAt: -1 });

module.exports = mongoose.model('Incident', incidentSchema);
