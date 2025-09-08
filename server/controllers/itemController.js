const cloudinary = require('cloudinary').v2;
const Item = require('../models/Items');
const transporter = require('../config/nodemailer');
const jwt = require('jsonwebtoken');

// POST /api/items - Add new item
const addItem = async (req, res) => {
  const { title, description, location, status } = req.body;
  let imageUrl = null;

  try {
    if (req.file) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'lostfound', timeout: 20000 },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
    }

    const item = new Item({
      title,
      description,
      location,
      status: status || 'pending',
      imageUrl,
      user: req.user.id,
    });

    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error('Add Item Error:', err);
    res.status(500).json({ message: 'Failed to add item', error: err.message });
  }
};

// GET /api/items - Public
const getAllItems = async (req, res) => {
  try {
    const { status, location, date } = req.query;
    const query = {};

    if (status) query.status = status;
    if (location) query.location = location;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lte: end };
    }

    const items = await Item.find(query).populate('user', 'name email');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch items' });
  }
};

// GET /api/items/my - Logged-in user's items
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your items' });
  }
};

// DELETE /api/items/:id - Delete item
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.user.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await item.deleteOne();
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ message: 'Failed to delete item', error: err.message });
  }
};

// PUT /api/items/:id - Update item info
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, status } = req.body;

    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    item.title = title || item.title;
    item.description = description || item.description;
    item.location = location || item.location;
    item.status = status || item.status;

    if (req.file) {
      const upload = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'lostfound' },
          (error, result) => (error ? reject(error) : resolve(result))
        ).end(req.file.buffer);
      });
      item.imageUrl = upload.secure_url;
    }

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update item', error: err.message });
  }
};

// PATCH /api/items/:id/status - Pending → Returned
const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);

    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to change status' });
    }

    if (item.status === 'pending') {
      item.status = 'returned';
      await item.save();
      return res.json({ message: 'Status updated', status: item.status });
    } else {
      return res.status(400).json({ message: 'Status can only change from pending to returned' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
};

// POST /api/items/notify-owner - Notify the owner via email
const notifyOwner = async (req, res) => {
  const { itemId, message } = req.body;

  try {
    const item = await Item.findById(itemId).populate('user');
    if (!item) {
      console.error('❌ Item not found');
      return res.status(400).json({ error: 'Item not found' });
    }

    if (!item.title || !item.user?.email) {
      console.error('❌ Missing item.title or user.email');
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const senderName = req.user.name;
    const senderEmail = req.user.email;

    const token = jwt.sign({ itemId: item._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    const deleteLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/api/items/delete-via-link/${token}`;

    const emailText = `
Hi ${item.user.name},

Someone is interested in your ${item.status} item: "${item.title}".

Message:
${message || "No message provided."}

Notifier:
Name: ${senderName}
Email: ${senderEmail}

If this item has already been claimed, you can delete it directly using this link:
${deleteLink}
`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: item.user.email,
      subject: `Interest in your ${item.status} item: "${item.title}"`,
      text: emailText,
    });

    console.log('✅ Email sent successfully');
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Notify Owner Error:', err);
    res.status(500).json({ error: 'Failed to notify owner' });
  }
};

// GET /api/items/delete-via-link/:token
const deleteViaLink = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const itemId = decoded.itemId;

    const deleted = await Item.findByIdAndDelete(itemId);
    if (!deleted) return res.status(404).send('Item already deleted or not found');

    res.send(`<h2>✅ Item deleted successfully.</h2><p>You can now close this tab.</p>`);
  } catch (err) {
    console.error('❌ Invalid or expired delete token:', err.message);
    res.status(400).send(`<h2>❌ Invalid or expired link.</h2><p>Please try again.</p>`);
  }
};

module.exports = {
  addItem,
  getAllItems,
  getMyItems,
  deleteItem,
  updateItem,
  toggleStatus,
  notifyOwner,
  deleteViaLink
};
