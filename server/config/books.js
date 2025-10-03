const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  publishedDate: {type: Date, default: Date.now},
  genre: String,
  pages: Number,
  likes: { type: Number, default: 0 },
  likedBy: { type: [String], default: [] } // store userIds who liked
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
