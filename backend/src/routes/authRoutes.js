const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleLogin, logoutUser, checkPhone } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);
router.post('/logout', logoutUser);
router.post('/check-phone', checkPhone);

module.exports = router;
