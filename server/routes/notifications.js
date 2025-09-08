const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/notify-owner
router.post('/notify-owner', async (req, res) => {
  const { email, itemTitle } = req.body;

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Interest in your item',
      text: `Someone is interested in your item: ${itemTitle}. Please check your account for more details.`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ message: 'Failed to send notification' });
  }
});

module.exports = router;
