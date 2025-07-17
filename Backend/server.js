const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const http = require("http");

// Load environment variables
dotenv.config();

// Import routes and models
const authRoutes = require("./Routes/Auth");
const documentRoutes = require("./Routes/Documents");
const chatRoutes = require("./Routes/Chat");
const Chat = require("./Models/Chat");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);          // includes /me route
app.use("/api/documents", documentRoutes);
app.use("/api/chat", chatRoutes);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Real-time events
io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  // Join document room
  socket.on("joinDocument", (documentId) => {
    socket.join(documentId);
    console.log(`User joined document ${documentId}`);
  });

  // Document editing
  socket.on("documentUpdate", ({ documentId, title, content }) => {
    socket.to(documentId).emit("receiveUpdate", { title, content });
  });

  // Chat messaging
  socket.on("sendMessage", async ({ documentId, message, senderId }) => {
    if (!senderId || !message || !documentId) {
      console.warn("Invalid chat message payload");
      return;
    }

    try {
      const newMessage = await Chat.create({
        documentId,
        sender: senderId,
        message
      });

      const populatedMessage = await newMessage.populate("sender", "name");

      io.to(documentId).emit("receiveMessage", {
        _id: populatedMessage._id,
        message: populatedMessage.message,
        sender: {
          _id: populatedMessage.sender._id,
          name: populatedMessage.sender.name
        },
        createdAt: populatedMessage.createdAt
      });
    } catch (err) {
      console.error("Chat message saving failed:", err);
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
