const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: String,
  location: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['lost', 'found', 'pending', 'returned'], 
    default: 'pending' 
  },
  imageUrl: { type: String },
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
