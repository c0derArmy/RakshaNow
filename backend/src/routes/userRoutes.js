const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { updateProfilePic } = require('../controllers/userController');

// @route   PUT api/users/profile-pic
// @desc    Update user profile picture
// @access  Private
router.put('/profile-pic', protect, upload.single('image'), updateProfilePic);

module.exports = router;
