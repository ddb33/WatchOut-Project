const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://192.168.50.10:4200', // Points to your Frontend VM
  credentials: true
}));

// MongoDB Connection
mongoose.connect('mongodb://192.168.50.30:27017/watchout')
  .then(() => console.log('Connected to MongoDB on .30'))
  .catch(err => console.error('Connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  watchlist: [{ type: String }],
  isVerified: { type: Boolean, default: false }, // Status as seen in DB check
  verificationToken: String
});

const User = mongoose.model('User', userSchema);

// --- AUTH ROUTES ---

// 1. Registration with Offline Verification Link
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = Math.random().toString(36).substring(2, 15);

    const newUser = new User({ 
      username, 
      email, 
      password: hashedPassword, 
      verificationToken: token 
    });
    
    await newUser.save();

    // Log the link for the professor to simulate the "Email"
    const verificationLink = `http://192.168.50.20:5000/api/auth/verify/${token}`;
    console.log('\n--- NEW USER REGISTERED ---');
    console.log(`Email: ${email}`);
    console.log(`Verification Link: ${verificationLink}\n`);

    res.status(201).json({ message: 'Registration successful! Check terminal for link.' });
  } catch (err) {
    res.status(400).json({ error: 'Registration failed', details: err.message });
  }
});

// 2. Verification Endpoint
app.get('/api/auth/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOneAndUpdate(
      { verificationToken: token },
      { isVerified: true, verificationToken: undefined }, // Sets isVerified to true
      { new: true }
    );

    if (!user) return res.status(404).send('Invalid or expired token.');

    res.send(`
      <div style="text-align:center; margin-top:50px; font-family:sans-serif;">
        <h1>Account Verified!</h1>
        <p>Your status is now: <strong>Verified</strong></p>
        <a href="http://192.168.50.10:4200/login" style="color:purple;">Click here to Login</a>
      </div>
    `);
  } catch (err) {
    res.status(500).send('Verification error.');
  }
});

// 3. Login with Route Matching fix
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare typed password with hashed DB password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Block unverified users
    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email first.' });
    }

    res.status(200).json({ 
      message: 'Login successful', 
      username: user.username, 
      email: user.email 
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- WATCHLIST ROUTES ---

// 4. Add Movie to Watchlist
app.post('/api/watchlist/add', async (req, res) => {
  try {
    const { email, movieId } = req.body;
    await User.findOneAndUpdate(
      { email }, 
      { $addToSet: { watchlist: movieId } } // Prevents duplicates in DB array
    );
    res.status(200).json({ message: 'Movie added to watchlist' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update watchlist' });
  }
});

// Start Server
app.listen(5000, '0.0.0.0', () => {
  console.log('Backend running at http://192.168.50.20:5000');
});
