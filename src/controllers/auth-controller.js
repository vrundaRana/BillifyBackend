const User = require('../models/User.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register User
const registerUser = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: 'Request body is missing.' });
    }

    const { firstName, lastName, email, password, businessName, businessType } = req.body;
    console.log("Request Body:", req.body);

    if (!firstName || !lastName || !email || !password || !businessName || !businessType) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      businessName,
      businessType
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        businessName: newUser.businessName,
        businessType: newUser.businessType
      }
    });
  } catch (error) {
    console.error(`Error in registerUser: ${error.message}`);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const loggedUser = await User.findOne({ email });
    if (!loggedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, loggedUser.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const accessToken = jwt.sign(
      { id: loggedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '10d' }
    );
    // During login success
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: 'User logged in successfully.',
      accessToken
    });
  } catch (error) {
    console.error(`Error in loginUser: ${error.message}`);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { registerUser, loginUser };
