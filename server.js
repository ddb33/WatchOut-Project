const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://192.168.50.10:4200', // Frontend VM IP
  credentials: true
}));

// MongoDB Connection to .30 VM
mongoose.connect('mongodb://192.168.50.30:27017/watchout')
  .then(() => console.log('Connected to MongoDB on .30'))
  .catch(err => console.error('Connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  watchlist: [{ type: String }], // Array of TMDB Movie IDs
  isVerified: { type: Boolean, default: false },
  verificationToken: String
});

const User = mongoose.model('User', userSchema);

// --- AUTHENTICATION ROUTES ---

// Registration Route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = Math.random().toString(36).substring(2, 15);

    const newUser = new User({ 
      username, 
      email, 
      password: hashedPassword, 
      verificationToken: token 
    });
    
    await newUser.save();

    // Verification link for offline demo
    console.log(`\nVERIFICATION LINK: http://192.168.50.20:5000/api/auth/verify/${token}\n`);

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Registration failed', details: err.message });
  }
});

// Verification Route
app.get('/api/auth/verify/:token', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { verificationToken: req.params.token },
      { isVerified: true, verificationToken: undefined },
      { new: true }
    );
    if (!user) return res.status(404).send('Invalid or expired verification link.');
    res.send('<h1>Account Verified!</h1><p>You can now <a href="http://192.168.50.10:4200/login">Login here</a>.</p>');
  } catch (err) {
    res.status(500).send('Server error during verification.');
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ error: 'Account not verified. Check terminal for link.' });
    }

    res.status(200).json({ 
      username: user.username, 
      email: user.email 
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

// --- WATCHLIST ROUTES ---

// Get Watchlist IDs
app.get('/api/watchlist/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    res.json(user ? user.watchlist : []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

// Add to Watchlist
app.post('/api/watchlist/add', async (req, res) => {
  try {
    const { email, movieId } = req.body;
    await User.findOneAndUpdate(
      { email }, 
      { $addToSet: { watchlist: movieId.toString() } } // Prevents duplicates
    );
    res.status(200).json({ message: 'Movie added to watchlist' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add movie' });
  }
});

// Remove from Watchlist
app.post('/api/watchlist/remove', async (req, res) => {
  try {
    const { email, movieId } = req.body;
    await User.findOneAndUpdate(
      { email },
      { $pull: { watchlist: movieId.toString() } } // Specifically removes this ID from the array
    );
    res.status(200).json({ message: 'Movie removed from watchlist' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove movie' });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend Server running on http://192.168.50.20:${PORT}`);
});
