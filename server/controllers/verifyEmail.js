// ✅ NEW FILE: server/controllers/verifyEmail.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).send('User not found');

    if (user.isVerified) return res.status(200).send('Already verified');
    user.isVerified = true;
    await user.save();

    res.redirect(`${process.env.CLIENT_URL}/login?verified=true`);
  } catch (err) {
    res.status(400).send('Invalid or expired token');
  }
};

module.exports = verifyEmail;