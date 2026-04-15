const express = require('express');
const router = express.Router();
const { triggerSOS } = require('../controllers/sosController');
const { protect } = require('../middleware/authMiddleware');

// Protected route: Requires a valid JWT token
router.post('/trigger', protect, triggerSOS);

module.exports = router;