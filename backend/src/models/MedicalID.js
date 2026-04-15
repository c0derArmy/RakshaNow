const mongoose = require('mongoose');

const medicalIdSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bloodGroup: { type: String, default: 'Unknown' },
  allergies: [{ type: String }],
  medications: [{ type: String }],
  emergencyContacts: [{
    name: { type: String, required: true },
    phone: { type: String, required: true }
  }]
});

module.exports = mongoose.model('MedicalID', medicalIdSchema);