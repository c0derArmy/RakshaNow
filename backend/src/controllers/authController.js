const User = require('../models/User');
const MedicalID = require('../models/MedicalID');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('../config/firebase');

exports.registerUser = async (req, res) => {
  try {
    console.log(`>>> [${new Date().toLocaleTimeString()}] REGISTRATION REQUEST:`, { ...req.body, password: '***' });
    const { name, phone, email, password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const cleanPhone = phone ? phone.replace(/\D/g, "") : null;

    const existingUser = await User.findOne({
      $or: [
        { phone: cleanPhone },
        { email: email?.toLowerCase() }
      ].filter(Boolean)
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this phone or email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      phone: cleanPhone,
      email: email?.toLowerCase(),
      password: hashedPassword,
      role: req.body.role || 'CITIZEN'
    });

    await MedicalID.create({ userId: user._id });

    const token = jwt.sign(
      { id: user._id, role: user.role },
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
        role: user.role
      },
      message: "Registration successful!"
    });

  } catch (error) {
    console.error("Registration Error:", error);
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0] || 'field';
      return res.status(400).json({ message: `${duplicateField} already in use` });
    }
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    console.log(`>>> [${new Date().toLocaleTimeString()}] LOGIN REQUEST:`, { phone: req.body.phone });
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password are required' });
    }

    const cleanPhone = phone.replace(/\D/g, "");
    const user = await User.findOne({ phone: cleanPhone });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic
      }
    });
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

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.findOne({ googleId: uid });
    }

    if (!user) {
      const existingUserWithNullPhone = await User.findOne({ phone: { $in: [null, ''] } });
      
      if (existingUserWithNullPhone) {
        existingUserWithNullPhone.name = name;
        existingUserWithNullPhone.email = email;
        existingUserWithNullPhone.googleId = uid;
        existingUserWithNullPhone.profilePic = picture;
        await existingUserWithNullPhone.save();
        user = existingUserWithNullPhone;
      } else {
        const newUser = new User({
          name: name,
          email: email,
          googleId: uid,
          profilePic: picture,
          role: 'CITIZEN'
        });
        user = await newUser.save();
        await MedicalID.create({ userId: user._id });
      }
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePic: user.profilePic
      }
    });

  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({ error: "Google login failed" });
  }
};

exports.checkPhone = async (req, res) => {
  try {
    const { phone } = req.body;
    const cleanPhone = phone ? phone.replace(/\D/g, "") : "";

    if (!cleanPhone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    const existingUser = await User.findOne({ phone: cleanPhone });
    if (existingUser) {
      return res.status(400).json({ message: "Phone number already registered", available: false });
    }

    res.status(200).json({ available: true });
  } catch (error) {
    res.status(500).json({ error: "Check failed" });
  }
};

exports.sendPhoneOTP = async (req, res) => {
  res.status(501).json({ message: "OTP service not enabled" });
};

exports.verifyPhoneOTP = async (req, res) => {
  res.status(501).json({ message: "OTP service not enabled" });
};

exports.sendEmailOTP = async (req, res) => {
  res.status(501).json({ message: "OTP service not enabled" });
};

exports.verifyEmailOTP = async (req, res) => {
  res.status(501).json({ message: "OTP service not enabled" });
};

exports.resendOTP = async (req, res) => {
  res.status(501).json({ message: "OTP service not enabled" });
};

exports.verifyBothOTP = async (req, res) => {
  res.status(501).json({ message: "OTP service not enabled" });
};

exports.sendOTP = async (req, res) => {
  res.status(501).json({ message: "OTP service not enabled" });
};

exports.verifyOTP = async (req, res) => {
  res.status(501).json({ message: "OTP service not enabled" });
};

exports.registerWithVerified = async (req, res) => {
  res.status(501).json({ message: "OTP service not enabled" });
};

exports.googleAddPhone = async (req, res) => {
  res.status(501).json({ message: "OTP service not enabled" });
};

exports.verifyGooglePhone = async (req, res) => {
  res.status(501).json({ message: "OTP service not enabled" });
};
