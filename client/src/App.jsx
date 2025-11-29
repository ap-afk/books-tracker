
import React, { useState, useEffect } from "react";
import axios from "axios";
// Ensure all axios requests use the backend URL (including port)
axios.defaults.baseURL = "https://books-tracker-backend-k6hy.onrender.com/";


export default function App() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publishedDate: "",
    genre: "",
    pages: ""
  });
  const [message, setMessage] = useState("");

  // Mock userId (replace with auth in real app)
  const userId = "user123";

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const res = await axios.get("/books");
      setBooks(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Error fetching books");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Polling for live updates (optional)
  useEffect(() => {
    const interval = setInterval(fetchBooks, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("/books", formData);
      setMessage("Book added successfully!");
      setBooks([...books, res.data]);
      setFormData({
        title: "",
        author: "",
        publishedDate: "",
        genre: "",
        pages: ""
      });
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error adding book");
    }
  };

  // Handle like button click
  const handleLike = async (bookId) => {
    try {
      const res = await axios.post(`/books/${bookId}/like`, { userId });
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === bookId ? { ...book, likes: res.data.likes, likedBy: [...(book.likedBy || []), userId] } : book
        )
      );
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error liking book");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Books Library</h1>

        <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Add a New Book</h2>
          {message && (
            <div className="mb-4 text-center text-sm text-red-600">{message}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
            />
            <input
          type="text"
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
            />
            <input
          type="date"
          name="publishedDate"
          placeholder="Published Date"
          value={formData.publishedDate}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
            />
            <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={formData.genre}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
            />
            <input
          type="number"
          name="pages"
          placeholder="Pages"
          value={formData.pages}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
            />
            <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            >
          Add Book
            </button>
          </form>
        </div>

        {/* Books List */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Books List</h2>
        <ul className="space-y-3">
          {books.map((book) => {
            const hasLiked = book.likedBy?.includes(userId);
            return (
              <li
                key={book._id}
                className="bg-white p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold">{book.title}</h3>
                  <p className="text-sm text-gray-600">
                    {book.author} | {book.genre} | {book.pages} pages
                  </p>
                  <button
                    onClick={() => handleLike(book._id)}
                    disabled={hasLiked}
                    className={`mt-2 px-3 py-1 text-white rounded text-xs transition ${
                      hasLiked
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-pink-500 hover:bg-pink-600"
                    }`}
                  >
                    ❤️ {hasLiked ? "Liked" : "Like"} {book.likes || 0}
                  </button>
                </div>
                <p className="text-gray-500 text-xs">
                  {book.publishedDate ? new Date(book.publishedDate).toLocaleDateString() : ""}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
