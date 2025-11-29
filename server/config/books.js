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

// Ensure the connection is established before exporting the model
mongoose.connection.once('open', () => {
  console.log("MongoDB connection established.");
});

module.exports = Book;
