require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors({
    origin: ['http://localhost:5173', 'http://10.0.2.2:5554', 'http://localhost:5000', 'http://localhost:5554', 'http://10.0.2.2:3000'],
    credentials: true 
}));
app.use(express.json());

// Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 login/register requests per windowMs
  message: 'Too many login attempts, please try again after 15 minutes',
});

app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// Load Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sos', require('./routes/sosRoutes'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0",() => {
  console.log(`🚨 RakshaNow Tactical API is running on port ${PORT}...`);
});