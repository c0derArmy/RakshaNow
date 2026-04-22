const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { updateProfilePic, updateProfile, updateLiveLocation, getLiveLocation } = require('../controllers/userController');
const User = require('../models/User');

// Test route for connectivity
router.get('/test', (req, res) => {
  console.log('🧪 TEST ROUTE HIT');
  res.json({ message: 'Server is reachable!', timestamp: new Date().toISOString() });
});

// @route   GET api/users/me
// @desc    Get current user data
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('❌ Error getting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/users/profile-pic
// @desc    Update user profile picture
// @access  Private
router.put('/profile-pic', protect, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('❌ Multer error:', err);
      return res.status(400).json({ message: 'File upload error', details: err.message });
    }
    next();
  });
}, updateProfilePic);

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, updateProfile);

// @route   PUT api/users/location
// @desc    Update user's live location
// @access  Private
router.put('/location', protect, updateLiveLocation);

// @route   GET api/users/:id/location
// @desc    Get user's live location
// @access  Private
router.get('/:id/location', protect, getLiveLocation);

module.exports = router;
