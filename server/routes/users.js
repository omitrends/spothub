// server/routes/users.js
const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser } = require('../controllers/userController');
const requireAuth = require('../middleware/authMiddleware'); // ✅ correct import
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', requireAuth, authorizeRoles('admin'), getAllUsers);
router.delete('/:id', requireAuth, authorizeRoles('admin'), deleteUser);

module.exports = router;
