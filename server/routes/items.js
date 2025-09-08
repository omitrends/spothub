const express = require('express');
const router = express.Router();

const requireAuth = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');
const Item = require('../models/Items');

// ✅ Destructure all controllers at once
const {
  addItem,
  getAllItems,
  getMyItems,
  deleteItem,
  updateItem,
  notifyOwner,
  deleteViaLink, // keep only this one
} = require('../controllers/itemController');

// Add new item
router.post('/', requireAuth, upload.single('photo'), addItem);

// Get all items
router.get('/', getAllItems);

// Get logged-in user's items
router.get('/my', requireAuth, getMyItems);

// 🔗 Delete via secure token link
router.get('/delete-via-link/:token', deleteViaLink);

// Get single item by ID
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch item' });
  }
});

// Update item details
router.put('/:id', requireAuth, upload.single('photo'), updateItem);

// Update status (Pending → Returned)
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update status' });
    }

    if (item.status !== 'returned') {
      item.status = 'returned';
      await item.save();
      return res.json({ message: 'Status updated successfully', status: item.status });
    }

    res.status(400).json({ message: 'Item is already returned' });
  } catch (err) {
    console.error('Status Update Error:', err);
    res.status(500).json({ message: 'Failed to update status' });
  }
});

// Delete item
router.delete('/:id', requireAuth, deleteItem);

// Notify owner
router.post('/notify-owner', requireAuth, notifyOwner);

module.exports = router;
