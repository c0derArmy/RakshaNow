const express = require('express');
const router = express.Router();
const { getIncidents, getAllIncidents, createIncident, updateIncidentStatus } = require('../controllers/incidentController');
const { protect } = require('../middleware/authMiddleware');

// Grouped by /api/incidents
router.route('/')
  .get(protect, getIncidents)
  .post(protect, createIncident);

// Get all incidents (for responders)
router.route('/all')
  .get(protect, getAllIncidents);

// Update incident status
router.route('/:id')
  .put(protect, updateIncidentStatus);

module.exports = router;
