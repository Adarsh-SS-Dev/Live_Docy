const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const { verifyToken } = require("../Middleware/jsttoken");

const router = express.Router();

// Register
// router.post("/register", async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, email, password: hashedPassword });
//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     console.error("Registration error:", err);
//     res.status(500).json({ message: "Server error during registration" });
//   }
// });

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // ✅ Generate JWT for the new user
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // ✅ Return token and user details
    res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        username: newUser.name,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Login
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "User does not exist" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid password" });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     res.status(200).json({ username: user.name, token });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Server error during login" });
//   }
// });

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // ✅ Return full user object with _id for frontend
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.name, // assuming `name` field in your schema
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});


// Get user info from token
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name _id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ name: user.name, id: user._id });
  } catch (error) {
    console.error("User fetch error:", error);
    res.status(500).json({ message: "Failed to fetch user info" });
  }
});

module.exports = router;
