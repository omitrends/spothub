// ✅ UPDATED FILE: server/routes/auth.js
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { signup, login, resetPassword } = require('../controllers/authController');
const verifyEmail = require('../controllers/verifyEmail');

const CLIENT_URL = 'http://localhost:5173';

router.post('/signup', signup);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.get('/verify-email/:token', verifyEmail);

// --- OAuth Routes ---

// 🔐 Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${CLIENT_URL}/auth/failure` }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const user = {
      _id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
    };

    res.redirect(`${CLIENT_URL}/auth/success?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
  }
);


// // 🔐 Facebook OAuth
// router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// router.get('/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: `${CLIENT_URL}/auth/failure` }),
//   (req, res) => {
//     const token = jwt.sign(
//       { id: req.user._id, email: req.user.email, role: req.user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     const user = {
//       _id: req.user._id,
//       email: req.user.email,
//       name: req.user.name,
//       role: req.user.role,
//     };

//     res.redirect(`${CLIENT_URL}/auth/success?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
//   }
// );


// 🔓 Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect(CLIENT_URL);
  });
});

// ❌ Failure
router.get('/auth/failure', (req, res) => {
  res.status(401).send('Authentication failed');
});

module.exports = router;
