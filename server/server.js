// server/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');
const connectCloudinary = require('./config/cloudinary');
require('./config/passport'); // Load strategies
const nodemailer = require('nodemailer');

const app = express();

// Connect to MongoDB and Cloudinary
connectDB();
connectCloudinary();

// Middleware
app.use(cors({
  origin: 'https://spothub-rouge.vercel.app', // frontend URL
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true if using https
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/users', require('./routes/users'));

// Email notification endpoint
// app.post('/api/notify-owner', async (req, res) => {
//   const { email, itemTitle } = req.body;

//   if (!email || !itemTitle) {
//     return res.status(400).json({ message: 'Email and item title are required' });
//   }

//   try {
//     // Configure transporter
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS, // Use App Password for Gmail
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Interest in your item',
//       text: `Hello,\n\nSomeone is interested in your item: "${itemTitle}". Please check your account for more details.\n\nThank you!`,
//     };

//     await transporter.sendMail(mailOptions);
//     res.json({ message: 'Notification email sent successfully!' });
//   } catch (error) {
//     console.error('Email send error:', error);
//     res.status(500).json({ message: 'Failed to send notification' });
//   }
// });

// Health check
app.get('/', (req, res) => res.send('API is running...'));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));


