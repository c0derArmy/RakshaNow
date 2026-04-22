const MedicalID = require('../models/MedicalID');

// @desc    Get user's Medical ID profile
// @route   GET /api/medical-id/:userId     
// @access  Private
exports.getMedicalId = async (req, res) => {
  try {
    const targetUserId = req.user.role === 'RESPONDER' ? req.params.userId : req.user.id;
    const medicalIdRecord = await MedicalID.findOne({ userId: targetUserId });

    if (!medicalIdRecord) {
      return res.status(200).json({
        userId: targetUserId,
        bloodGroup: '',
        allergies: [],
        medications: [],
        emergencyContacts: []
      });
    }

    res.status(200).json(medicalIdRecord);
  } catch (error) {
    console.error("Get Medical ID Error:", error);
    res.status(500).json({ error: 'Failed to fetch Medical ID' });
  }
};

// @desc    Update Medical ID profile
// @route   PUT /api/medical-id/:userId
// @access  Private
exports.updateMedicalId = async (req, res) => {
  try {
    const { bloodGroup, allergies, medications, emergencyContacts } = req.body;
    const targetUserId = req.user.role === 'RESPONDER' ? req.params.userId : req.user.id;

    let medicalIdRecord = await MedicalID.findOne({ userId: targetUserId });

    if (!medicalIdRecord) {
      medicalIdRecord = new MedicalID({ userId: targetUserId });
    }

    medicalIdRecord.bloodGroup = bloodGroup ?? medicalIdRecord.bloodGroup;
    medicalIdRecord.allergies = allergies ?? medicalIdRecord.allergies;
    medicalIdRecord.medications = medications ?? medicalIdRecord.medications;
    medicalIdRecord.emergencyContacts = emergencyContacts ?? medicalIdRecord.emergencyContacts;

    await medicalIdRecord.save();

    res.status(200).json(medicalIdRecord);
  } catch (error) {
    console.error("Update Medical ID Error:", error);
    res.status(500).json({ error: 'Failed to update Medical ID' });
  }
};
