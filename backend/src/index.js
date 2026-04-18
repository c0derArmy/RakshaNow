require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');

const app = express();

// ✅ CRUCIAL: Enable JSON parsing middleware
app.use(express.json());

app.use(cors({
  origin: true,   // ✅ Allow all origins
  credentials: true
}));

// Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many login attempts, please try again after 15 minutes',
});

app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// Load Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sos', require('./routes/sosRoutes'));
app.use('/api/incidents', require('./routes/incidentRoutes'));
app.use('/api/medical-id', require('./routes/medicalIdRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Wait for MongoDB first
    await connectDB();
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚨 RakshaNow Tactical API is running on port ${PORT}...`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();