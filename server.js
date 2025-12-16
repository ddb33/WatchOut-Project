const statsRoute = require("./routes/stats");
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize App
const app = express();

// Middleware
app.use(express.json()); // Accepts JSON data
app.use(cors()); // Allows Angular (Port 4200) to connect

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    // Exit process if DB connection fails
    process.exit(1); 
  }
};

// Connect to Database
connectDB();

// --- ROUTE IMPORTS ---
const authRoute = require("./routes/auth"); 
const usersRoute = require("./routes/users"); 
const watchlistRoute = require("./routes/watchlist"); // NEW: Watchlist Route

// --- ROUTE USAGE ---
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/watchlist", watchlistRoute); // NEW: Use the Watchlist Route

// Simple Test Route
app.get('/', (req, res) => {
  res.send('API is running securely...');
});

// Start Server
app.use("/api/stats", statsRoute);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
