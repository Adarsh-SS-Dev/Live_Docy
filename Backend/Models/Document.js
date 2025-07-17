const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Userdata', // ✅ Match your actual user model name
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', documentSchema);
