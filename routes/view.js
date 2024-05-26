const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const auth = require("../middleware/auth");

// Admin Dashboard
router.get("/admin", auth, async (req, res) => {
  try {
    const books = await Book.find();
    res.render("admin", { books });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
