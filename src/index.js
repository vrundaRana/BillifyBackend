const express = require('express');
const connectDB = require('./config/connectDB');
const authRoute = require('./routes/auth-route');
const receiptRoute = require('./routes/receipt-route');
const cors = require("cors");
const cookieParser = require("cookie-parser"); // ✅ Needed for reading JWT cookies
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", // ✅ specify origin
  credentials: true, // ✅ allow cookies
}));
app.use(express.json());
app.use(cookieParser()); // ✅ Required for reading cookies in authMiddleware

// Routes
app.use('/api/auth', authRoute);
app.use('/api/receipts', receiptRoute);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});

