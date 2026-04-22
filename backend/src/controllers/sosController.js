const Incident = require('../models/Incident');
const User = require('../models/User');
const MedicalID = require('../models/MedicalID');
const { analyzeEmergency } = require('../utils/aiUtils');
const { sendEmergencySMS, dispatchEmergencyCalls } = require('../utils/twilioUtils');

exports.triggerSOS = async (req, res) => {
  try {
    console.log(`>>> [${new Date().toLocaleTimeString()}] SOS TRIGGERED`);
    const { description, location, userName, userPhone, userEmail } = req.body;
    const userId = req.user.id;
    console.log(`>>> User ID: ${userId}, Description: ${description}`);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const name = userName || user.name;
    const phone = userPhone || user.phone;
    const email = userEmail || user.email;

    console.log(`>>> Calling AI for: "${description}"`);
    const aiAnalysis = await analyzeEmergency(description);
    console.log(`>>> AI Result:`, aiAnalysis);

    const newIncident = await Incident.create({
      userId: user._id,
      type: aiAnalysis.classification,
      transcript: aiAnalysis.summary,
      location: location
    });

    const medicalInfo = await MedicalID.findOne({ userId: user._id });
    const emergencyContacts = medicalInfo?.emergencyContacts || [];

    const allergies = medicalInfo?.allergies?.length > 0
      ? medicalInfo.allergies.join(', ')
      : '';
    const bloodGroup = medicalInfo?.bloodGroup || '';
    const medications = medicalInfo?.medications?.length > 0
      ? medicalInfo.medications.join(', ')
      : '';

    const medicalText = [
      bloodGroup ? `Blood Group: ${bloodGroup}` : '',
      allergies ? `Allergies: ${allergies}` : '',
      medications ? `Medications: ${medications}` : ''
    ].filter(Boolean).join(' | ');

    if (emergencyContacts.length > 0) {
      await sendEmergencySMS(
        emergencyContacts,
        name,
        phone,
        email,
        location,
        aiAnalysis.classification,
        aiAnalysis.summary,
        medicalText
      );

      await dispatchEmergencyCalls(
        emergencyContacts,
        name,
        phone,
        location,
        aiAnalysis.classification,
        aiAnalysis.summary,
        medicalText
      );
    }

    console.log(`>>> SOS Created - Type: ${newIncident.type}, Transcript: ${newIncident.transcript}`);
    
    res.status(200).json({
      success: true,
      message: 'SOS Dispatched',
      incident: {
        _id: newIncident._id,
        type: newIncident.type,
        transcript: newIncident.transcript,
        status: newIncident.status,
        location: newIncident.location,
        reportedAt: newIncident.reportedAt,
        createdAt: newIncident.reportedAt
      },
      contactsNotified: emergencyContacts.length
    });
  } catch (error) {
    console.error("SOS ERROR:", error.message);
    res.status(500).json({
      error: 'Failed to process SOS',
      details: error.message
    });
  }
};
