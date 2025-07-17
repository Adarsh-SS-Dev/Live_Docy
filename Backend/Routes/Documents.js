const express = require('express');
const Document = require('../Models/Document');
const { verifyToken } = require('../Middleware/jsttoken');
const router = express.Router();

// 📄 Get all documents
router.get('/', verifyToken, async (req, res) => {
  try {
    const documents = await Document.find().populate("owner", "name");
    res.json(documents);
  } catch (error) {
    console.error("Fetch all documents error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 📄 Get a single document
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate("owner", "name");
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 📝 Create a new document (only logged-in users)
router.post('/', verifyToken, async (req, res) => {
  const { title, content } = req.body;

  try {
    const newDocument = await Document.create({
      title,
      content,
      owner: req.user.id,
    });

    res.status(201).json(newDocument);
  } catch (error) {
    console.error("❌ Document creation error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✏️ Update document — ✅ Any logged-in user can update
router.put('/:id', verifyToken, async (req, res) => {
  const { title, content } = req.body;

  try {
    const updatedDocument = await Document.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    if (!updatedDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json(updatedDocument);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🗑️ Delete document — ❌ Only owner can delete
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the creator can delete this document' });
    }

    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
