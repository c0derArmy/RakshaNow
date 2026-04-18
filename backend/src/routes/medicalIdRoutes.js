const express = require('express');
const router = express.Router();
const { getMedicalId, updateMedicalId } = require('../controllers/medicalIdController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:userId')
  .get(protect, getMedicalId)
  .put(protect, updateMedicalId);

module.exports = router;
