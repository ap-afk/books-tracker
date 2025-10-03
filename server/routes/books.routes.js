const express = require("express");
const router = express.Router();
const Book = require("../config/books"); // adjust path if needed
const mongoose = require("mongoose");

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a new book
router.post("/", async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    console.error("Error adding book:", err);
    res.status(400).json({ message: err.message });
  }
});

// Like a book (user can like only once)
router.post("/:bookId/like", async (req, res) => {
  try {
    const { bookId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Ensure likedBy array exists
    if (!Array.isArray(book.likedBy)) {
      book.likedBy = [];
    }

    // Check if user already liked
    if (book.likedBy.includes(userId)) {
      return res.status(400).json({ message: "You have already liked this book" });
    }

    // Add like
    book.likes = (book.likes || 0) + 1;
    book.likedBy.push(userId);
    await book.save();

    res.json({ likes: book.likes });
  } catch (err) {
    console.error("Error in like route:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
