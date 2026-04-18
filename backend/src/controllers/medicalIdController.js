const MedicalID = require('../models/MedicalID');

// @desc    Get user's Medical ID profile
// @route   GET /api/medical-id/:userId     
// @access  Private
exports.getMedicalId = async (req, res) => {
  try {
    // Only allow fetching their own profile or if they are admin/responder
    // We assume self lookup for now based on req.user.id
    const medicalIdRecord = await MedicalID.findOne({ userId: req.user.id });

    if (!medicalIdRecord) {
      // Return a blank one
      return res.status(200).json({
        userId: req.user.id,
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

    let medicalIdRecord = await MedicalID.findOne({ userId: req.user.id });

    if (!medicalIdRecord) {
      medicalIdRecord = new MedicalID({ userId: req.user.id });
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
