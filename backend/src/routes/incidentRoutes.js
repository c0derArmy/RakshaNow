const express = require('express');
const router = express.Router();
const { getIncidents, createIncident } = require('../controllers/incidentController');
const { protect } = require('../middleware/authMiddleware');

// Grouped by /api/incidents
router.route('/')
  .get(protect, getIncidents)
  .post(protect, createIncident);

module.exports = router;
