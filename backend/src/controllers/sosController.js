const Incident = require('../models/Incident');
const User = require('../models/User');
const MedicalID = require('../models/MedicalID');
const { analyzeEmergency } = require('../utils/aiUtils');
const { dispatchAutomatedCalls } = require('../utils/twilioUtils');

exports.triggerSOS = async (req, res) => {
  try {
    const { description, location } = req.body;
    const userId = req.user.id; // Securely extracted from JWT

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // 1. AI Classification
    const aiAnalysis = await analyzeEmergency(description);

    // 2. Save Incident
    const newIncident = await Incident.create({
      userId: user._id,
      type: aiAnalysis.classification,
      transcript: aiAnalysis.summary,
      location: location
    });

    // 3. Fetch Medical ID for Emergency Contacts
    const medicalInfo = await MedicalID.findOne({ userId: user._id });

    // 4. Trigger Twilio Dispatch
    if (medicalInfo && medicalInfo.emergencyContacts && medicalInfo.emergencyContacts.length > 0) {
      // Don't await this to keep the SOS response fast
      dispatchAutomatedCalls(medicalInfo.emergencyContacts, user.name, aiAnalysis.classification);
    }

    res.status(200).json({ success: true, message: 'SOS Dispatched', incident: newIncident });
  } catch (error) {
    console.error("🚨 CRITICAL SOS ERROR:", {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    res.status(500).json({ 
      error: 'Failed to process SOS',
      details: error.message
    });
  }
};