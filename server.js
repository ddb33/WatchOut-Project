const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Added bcrypt library
const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://192.168.50.10:4200', // Matches your working private IP
  methods: ['GET', 'POST'],
  credentials: true
}));

mongoose.connect('mongodb://192.168.50.30:27017/watchout')
  .then(() => console.log('Connected to MongoDB on .30'))
  .catch(err => console.error('Connection error:', err));

// UPDATED SCHEMA: Includes watchlist for the "Track Movies" deliverable
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  watchlist: [{ type: String }] // Array to store TMDB Movie IDs
});

const User = mongoose.model('User', userSchema);

// UPDATED REGISTER: Hashes passwords before saving
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Encrypting
    const newUser = new User({ username, email, password: hashedPassword, watchlist: [] });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Registration failed', details: err.message });
  }
});

// UPDATED LOGIN: Compares hashed passwords
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Return the email and username so the frontend can "remember" who is logged in
    res.status(200).json({ 
      message: 'Login successful', 
      username: user.username,
      email: user.email 
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 6. Watchlist Route: "Track Movies" Deliverable
app.post('/api/watchlist/add', async (req, res) => {
  try {
    const { email, movieId } = req.body;
    
    // Find user and add movie ID to their watchlist array if it's not already there
    const user = await User.findOneAndUpdate(
      { email: email },
      { $addToSet: { watchlist: movieId } }, 
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.status(200).json({ message: 'Movie added to watchlist', watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update watchlist' });
  }
});

app.listen(5000, '0.0.0.0', () => console.log('Backend running on port 5000'));
