const Incident = require('../models/Incident');
const User = require('../models/User');

// @desc    Get logged in user incidents
// @route   GET /api/incidents
// @access  Private
exports.getIncidents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    
    // Responder role gets all incidents, citizen gets only their own
    let incidents, total;
    if (req.user.role === 'RESPONDER') {
      incidents = await Incident.find()
        .sort({ reportedAt: -1 })
        .limit(limit)
        .skip(skip);
      total = await Incident.countDocuments();
    } else {
      incidents = await Incident.find({ userId: req.user.id })
        .sort({ reportedAt: -1 })
        .limit(limit)
        .skip(skip);
      total = await Incident.countDocuments({ userId: req.user.id });
    }
    res.status(200).json({
      incidents,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error("Get Incidents Error:", error);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
};

// @desc    Get all incidents (for responders)
// @route   GET /api/incidents/all
// @access  Private (Responder only)
exports.getAllIncidents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const incidents = await Incident.find()
      .sort({ reportedAt: -1 })
      .limit(limit)
      .populate('userId', 'name phone');
    res.status(200).json(incidents);
  } catch (error) {
    console.error("Get All Incidents Error:", error);
    res.status(500).json({ error: 'Failed to fetch all incidents' });
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

// @desc    Update incident status
// @route   PUT /api/incidents/:id
// @access  Private (Responder only)
exports.updateIncidentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    console.log(`>>> [${new Date().toLocaleTimeString()}] UPDATE STATUS REQUEST:`, {
      incidentId: req.params.id,
      newStatus: status,
      body: req.body
    });

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      console.log(`>>> INCIDENT NOT FOUND: ${req.params.id}`);
      return res.status(404).json({ message: 'Incident not found' });
    }

    console.log(`>>> Current incident status: ${incident.status}, new status: ${status}`);

    incident.status = status;
    await incident.save();

    console.log(`>>> SUCCESS: Status updated to: ${incident.status}`);
    res.status(200).json(incident);
  } catch (error) {
    console.error("Update Incident Error:", error);
    res.status(500).json({ message: 'Failed to update incident' });
  }
};

// @desc    Notify incident reporter
// @route   POST /api/incidents/:id/notify
// @access  Private (Responder only)
exports.notifyReporter = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id).populate('userId', 'name phone');
    
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    const userPhone = incident.userId?.phone;
    
    if (!userPhone) {
      return res.status(400).json({ error: 'User phone number not found' });
    }

    const responder = await User.findById(req.user.id).select('name');
    const responderName = responder?.name || 'A Responder';
    
    // Send SMS notification
    const { sendSMS } = require('../utils/twilioUtils');
    const message = `RakshaNow: ${responderName} is responding to your emergency report "${incident.type}". They will arrive at your location shortly. Stay safe!`;
    
    await sendSMS(userPhone, message);
    
    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error("Notify Reporter Error:", error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
};
