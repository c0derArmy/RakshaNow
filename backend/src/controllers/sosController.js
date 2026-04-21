const Incident = require('../models/Incident');
const User = require('../models/User');
const MedicalID = require('../models/MedicalID');
const { analyzeEmergency } = require('../utils/aiUtils');
const { dispatchEmergencyCalls, sendEmergencySMS } = require('../utils/twilioUtils');

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
    const emergencyContacts = medicalInfo?.emergencyContacts || [];

    // 4. Trigger Emergency Calls and SMS to all contacts
    if (emergencyContacts.length > 0) {
      // Make emergency calls to contacts
      dispatchEmergencyCalls(
        emergencyContacts, 
        user.name, 
        user.phone, 
        location, 
        aiAnalysis.classification
      );
      
      // Send emergency SMS to contacts
      sendEmergencySMS(
        emergencyContacts, 
        user.name, 
        user.phone, 
        location, 
        aiAnalysis.classification
      );
    }

    // 5. Also send SMS to user's own phone
    if (user.phone) {
      const userMessage = `🚨 RAKSHANOW ALERT 🚨\n\nYour SOS has been triggered.\nEmergency contacts have been notified.\nStay calm and stay safe. Help is on the way!`;
      const { sendSMS } = require('../utils/twilioUtils');
      sendSMS(user.phone, userMessage);
    }

    res.status(200).json({ 
      success: true, 
      message: 'SOS Dispatched', 
      incident: newIncident,
      contactsNotified: emergencyContacts.length
    });
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