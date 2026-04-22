const express = require('express');
const router = express.Router();
const { triggerSOS, testSMS } = require('../controllers/sosController');
const { analyzeEmergency } = require('../utils/aiUtils');
const { protect } = require('../middleware/authMiddleware');

// Protected route: Requires a valid JWT token
router.post('/trigger', protect, triggerSOS);

// TEST AI - No auth needed
router.post('/test-ai', async (req, res) => {
  const { description } = req.body;
  console.log("🧪 [TEST] AI endpoint called with:", description);
  const result = await analyzeEmergency(description);
  console.log("🧪 [TEST] AI result:", result);
  res.json(result);
});

// Test SMS route (no auth needed for testing)
router.post('/test-sms', async (req, res) => {
  try {
    const { sendEmergencySMS } = require('../utils/smsUtils');
    const { userName, userPhone, contactPhone, contactName, message } = req.body;

    const contacts = [{
      name: contactName || 'Test Contact',
      phone: contactPhone || '9999999999'
    }];

    await sendEmergencySMS(
      contacts,
      userName || 'Test User',
      userPhone || '+919999999999',
      null,
      'TEST',
      message || 'Test message from RakshaNow',
      ''
    );

    res.json({ success: true, message: 'SMS test initiated. Check backend console.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;