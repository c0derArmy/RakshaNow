const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { updateProfilePic } = require('../controllers/userController');

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

module.exports = router;
