const express = require("express");
const Chat = require("../Models/Chat");
const { verifyToken } = require("../Middleware/jsttoken");

const router = express.Router();

// ✅ GET all chat messages for a document
router.get("/:documentId", verifyToken, async (req, res) => {
  try {
    const messages = await Chat.find({ documentId: req.params.documentId })
      .populate("sender", "name") // sender is from Userdata model
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error("Failed to fetch chat messages:", err.message);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// ✅ POST a new chat message
router.post("/", verifyToken, async (req, res) => {
  const { documentId, message } = req.body;
  const senderId = req.userId; // set by verifyToken middleware

  // Debug log (optional for development)
  // console.log("documentId:", documentId, "message:", message, "senderId:", senderId);

  if (!documentId || !message || !senderId) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const newMessage = await Chat.create({
      documentId,
      sender: senderId,
      message,
    });

    const populatedMessage = await newMessage.populate("sender", "name");

    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error("Error saving chat message:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
