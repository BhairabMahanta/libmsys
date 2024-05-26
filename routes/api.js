const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config");

const Book = require("../models/book");
const auth = require("../middleware/auth");

// Register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({ username, password });
    await user.save();
    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" });

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get All Books
router.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Add a New Book
router.post("/books", auth, async (req, res) => {
  const { title, author, description } = req.body;
  try {
    const newBook = new Book({ title, author, description });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Update a Book
router.put("/books/:id", auth, async (req, res) => {
  const { title, author, description } = req.body;
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, description },
      { new: true }
    );
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete a Book
router.delete("/books/:id", auth, async (req, res) => {
  try {
    await Book.findByIdAndRemove(req.params.id);
    res.status(200).json({ msg: "Book removed" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
