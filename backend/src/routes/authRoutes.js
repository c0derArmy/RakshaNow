const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleLogin, logoutUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);
router.post('/logout', logoutUser);

module.exports = router;