// ✅ NEW FILE: server/utils/generateEmailToken.js
const jwt = require('jsonwebtoken');

const generateEmailToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = generateEmailToken;