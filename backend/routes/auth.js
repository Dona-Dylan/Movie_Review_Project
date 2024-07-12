const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const cookieParser = require('cookie-parser');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

// Middleware to parse cookies
router.use(cookieParser());

/**
 * @route   POST api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/signup',
  [
    // Validate and sanitize inputs
    check('fullName', 'Full name is required').not().isEmpty(),
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    // Find validation errors in the request and wrap them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract user details from the request body
    const { fullName, username, email, password } = req.body;

    try {
      // Check if the user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      // Create a new user instance
      user = new User({
        fullName,
        username,
        email,
        password
      });

      // Generate a salt and hash the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save the new user to the database
      await user.save();

      // Create a payload to include the user ID
      const payload = {
        user: {
          id: user.id
        }
      };

      // Sign the JWT and send it in a cookie
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '24h' },
        (err, token) => {
          if (err) throw err;
          res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

/**
 * @route   POST api/auth/signin
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post(
  '/signin',
  [
    // Validate and sanitize inputs
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    // Find validation errors in the request and wrap them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract user credentials from the request body
    const { email, password } = req.body;

    try {
      // Check if the user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // Compare the provided password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // Create a payload to include the user ID
      const payload = {
        user: {
          id: user.id
        }
      };

      // Sign the JWT and send it in a cookie
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '24h' },
        (err, token) => {
          if (err) throw err;
          res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

/**
 * @route   POST api/auth/signout
 * @desc    Sign out the user
 * @access  Public
 */
router.post('/signout', (req, res) => {
  // Clear the authentication cookie
  res.clearCookie('token');
  res.json({ msg: 'Signed out successfully' });
});

module.exports = router;

