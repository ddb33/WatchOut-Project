const mongoose = require('mongoose');
const fs = require('fs');

// Connect to the Private Database
mongoose.connect('mongodb://192.168.50.30:27017/watchout_db')
  .then(() => {
    console.log('Connected to MongoDB at 192.168.50.30');
    importData();
  })
  .catch(err => console.error('DB Connection Error:', err));

const Movie = mongoose.model('Movie', new mongoose.Schema({
  title: String,
  releaseDate: String,
  genre: String,
  description: String,
  rating: Number,
  posterPath: String
}));

async function importData() {
  try {
    // 1. Read the file we downloaded earlier
    const fileData = fs.readFileSync('movies.json', 'utf-8');
    const movies = JSON.parse(fileData);

    // 2. Clear old data and insert new
    await Movie.deleteMany({});
    console.log('Old data cleared.');
    
    await Movie.insertMany(movies);
    console.log(`Successfully inserted ${movies.length} movies into the database!`);
    
    process.exit();
  } catch (err) {
    console.error('Import failed:', err);
    process.exit(1);
  }
}
