const express = require("express");
const cors = require("cors");
const connectDB = require("./db/db");
const bookRoutes = require("./routes/books.routes"); // adjust path
require("dotenv").config(); // Load .env at the top

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON bodies

// Connect to MongoDB
connectDB()
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/books", bookRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
