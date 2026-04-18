const Incident = require('../models/Incident');

// @desc    Get logged in user incidents
// @route   GET /api/incidents
// @access  Private
exports.getIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find({ userId: req.user.id }).sort({ reportedAt: -1 });
    res.status(200).json(incidents);
  } catch (error) {
    console.error("Get Incidents Error:", error);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
};

// @desc    Create a new manual incident
// @route   POST /api/incidents
// @access  Private
exports.createIncident = async (req, res) => {
  try {
    const { title, type, location, landmark, transcript, desc, status } = req.body;
    
    const newIncident = await Incident.create({
      userId: req.user.id,
      title: title || 'Emergency Alert',
      type: type || 'UNKNOWN',
      transcript: transcript || desc || '',
      desc: desc || transcript || '',
      status: status || 'CRITICAL',
      landmark: landmark || '',
      location: (location && typeof location === 'object') ? location : { address: typeof location === 'string' ? location : '' }
    });

    res.status(201).json(newIncident);
  } catch (error) {
    console.error("Create Incident Error:", error);
    res.status(500).json({ error: 'Failed to create incident' });
  }
};
