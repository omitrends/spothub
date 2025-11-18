// server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailer');
const generateEmailToken = require('../utils/generateEmailToken');

const ADMIN_INVITE_CODE = process.env.ADMIN_INVITE_CODE;

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, inviteCode } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const isAdmin = role === "admin" && inviteCode === ADMIN_INVITE_CODE;
    if (role === "admin" && !isAdmin) {
      return res.status(403).json({
        message: "Invalid or missing invite code for admin registration",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      isVerified: isAdmin ? true : false,
    });

    await user.save();

    // Send email if not admin
    if (!isAdmin) {
      const emailToken = generateEmailToken(user._id);
      const verifyLink = `${process.env.CLIENT_URL}/verify-email/${emailToken}`;

      console.log("Verify Link:", verifyLink);

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Verify your email - spothub",
        html: `<p>Hi ${user.name},</p><p>Click <a href="${verifyLink}">here</a> to verify your email.</p>`,
      });

      console.log("Email sent!");
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials for email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials for password' });

    // if (!user.isVerified && user.role !== 'admin') {
    //   return res.status(403).json({ message: 'Please verify your email before logging in' });
    // }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};