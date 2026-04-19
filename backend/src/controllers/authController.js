const User = require('../models/User');
const MedicalID = require('../models/MedicalID');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('../config/firebase');

exports.registerUser = async (req, res) => {
  try {
    console.log(`>>> [${new Date().toLocaleTimeString()}] REGISTRATION REQUEST:`, { ...req.body, password: '***' });
    const { name, phone, email, password } = req.body;

    // ==========================================
    // 🛡️ PASSWORD VALIDATION (Relaxed for development)
    // ==========================================
    const passwordRegex = /^.{6,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Weak Password",
        details: "Password must be at least 6 characters long.",
      });
    }

    // ==========================================
    // 🛡️ CHECK USER EXISTS (PHONE OR EMAIL)
    // ==========================================
    let user = await User.findOne({
      $or: [{ phone }, { email }],
    });

    if (user) {
      return res.status(400).json({
        message: "User already exists with this phone or email",
      });
    }

    // ==========================================
    // HASH PASSWORD
    // ==========================================
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ==========================================
    // CREATE USER WITH EMAIL
    // ==========================================
    user = await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
      role: req.body.role || 'CITIZEN',
    });

    // Auto-create Medical ID
    await MedicalID.create({ userId: user._id });

    // JWT TOKEN
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    console.log(`>>> [${new Date().toLocaleTimeString()}] LOGIN REQUEST:`, { phone: req.body.phone });
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(200).json({ token, user: { id: user._id, name: user.name, phone: user.phone, email: user.email } });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ error: 'Logout failed' });
  }
};




exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "ID Token required" });
    }

    // verify firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const { uid, email, name, picture } = decodedToken;

    // check user exists
    let user = await User.findOne({ email });

    // if not exists → create
    if (!user) {
      user = await User.create({
        name: name,
        email: email,
        googleId: uid,
        profilePic: picture,
        role: 'CITIZEN' // Default for Google Login
      });

      // ✅ Auto-create Medical ID for Google User
      await MedicalID.create({ userId: user._id });
    }

    // generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic
      }
    });

  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({ error: "Google login failed" });
  }
};