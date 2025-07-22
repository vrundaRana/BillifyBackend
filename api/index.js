const express = require('express');
const connectDB = require('../src/config/connectDB');
const authRoute = require('../src/routes/auth-route');
const receiptRoute = require('../src/routes/receipt-route');
const analyticsRoute = require('../src/routes/analytics-route');
const cors = require("cors");
const cookieParser = require("cookie-parser");
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/receipts', receiptRoute);
app.use('/api/analytics', analyticsRoute);

// For Vercel
app.get('/', (req, res) => {
  res.send('Billify API is running');
});

// Export the Express API
module.exports = app;