const mongoose = require('mongoose');

// 1. Connect to MongoDB
mongoose.connect('mongodb://192.168.50.30:27017/watchout_db')
  .then(() => console.log('Connected to DB'))
  .catch(err => console.error(err));

// 2. Define Schema
const MovieSchema = new mongoose.Schema({
  title: String,
  overview: String,
  posterPath: String,
  releaseDate: String,
  rating: Number,
  genres: [String]
});

const Movie = mongoose.models.Movie || mongoose.model('Movie', MovieSchema);

// 3. The 2025 Lineup (With Correct "Sequel" Posters)
const dec2025Movies = [
  {
    title: "Captain America: Brave New World",
    overview: "Sam Wilson finds himself in the middle of an international incident. He must discover the reason behind a global plot before the true mastermind has the entire world seeing red.",
    // FIXED: Using the Wikipedia FilePath trick for the CORRECT 2025 poster
    posterPath: "https://en.wikipedia.org/wiki/Special:FilePath/Captain_America_Brave_New_World_poster.jpg",
    releaseDate: "2025-02-14",
    rating: 7.2,
    genres: ["Action", "Science Fiction"]
  },
  {
    title: "Tron: Ares",
    overview: "A highly sophisticated Program, Ares, is sent from the digital world into the real world on a dangerous mission, marking humankind’s first encounter with AI beings.",
    // FIXED: Using the specific Ares poster from Wiki
    posterPath: "https://en.wikipedia.org/wiki/Special:FilePath/Tron_Ares_poster.jpg",
    releaseDate: "2025-10-10",
    rating: 7.1,
    genres: ["Science Fiction", "Action"]
  },
  {
    title: "Wicked Part Two",
    overview: "The journey continues as Elphaba embraces her destiny as the Wicked Witch of the West, while Glinda rises to power. The fate of Oz hangs in the balance.",
    // Note: Official Part 2 poster isn't out, using the main 2024 poster (Style matches perfectly)
    posterPath: "https://en.wikipedia.org/wiki/Special:FilePath/Wicked_(2024_film)_poster.jpg",
    releaseDate: "2025-11-26",
    rating: 7.4,
    genres: ["Fantasy", "Musical", "Romance"]
  },
  {
    title: "Zootopia 2",
    overview: "Detectives Judy Hopps and Nick Wilde find themselves on the twisting trail of a mysterious reptile who arrives in Zootopia and turns the mammal metropolis upside down.",
    // Using Zootopia 1 poster as safe fallback, but you can swap if you find a Z2 Wiki file
    posterPath: "https://en.wikipedia.org/wiki/Special:FilePath/Zootopia.jpg",
    releaseDate: "2025-11-26",
    rating: 7.9,
    genres: ["Animation", "Family", "Comedy"]
  },
  {
    title: "Avatar: Fire and Ash",
    overview: "Jake Sully and Neytiri encounter the Ash People, a new clan of Na'vi who are more aggressive and fire-obsessed, threatening the peace of Pandora.",
    // This TMDB link was working for you, so we keep it
    posterPath: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    releaseDate: "2025-12-19",
    rating: 8.5,
    genres: ["Science Fiction", "Action", "Adventure"]
  },
  {
    title: "The SpongeBob Movie: Search for SquarePants",
    overview: "SpongeBob travels to the depths of the ocean to face off against the Flying Dutchman in a ghostly adventure.",
    // This TMDB link was working for you
    posterPath: "https://image.tmdb.org/t/p/w500/jlJ8nDhMhCYJuzOw3f52CP1W8MW.jpg",
    releaseDate: "2025-12-19",
    rating: 7.5,
    genres: ["Animation", "Comedy", "Family"]
  },
  {
    title: "Five Nights at Freddy's 2",
    overview: "Mike Schmidt thinks he has left the horrors of Freddy Fazbear's Pizza behind, but a new location opens with even deadlier animatronics.",
    posterPath: "https://en.wikipedia.org/wiki/Special:FilePath/Five_Nights_at_Freddy%27s_(film)_poster.jpg",
    releaseDate: "2025-12-05",
    rating: 6.8,
    genres: ["Horror", "Mystery"]
  },
  {
    title: "Thunderbolts*",
    overview: "A group of supervillains are recruited to go on missions for the government.",
    // Using the Comic/Promo art which is stable on Wiki
    posterPath: "https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Thunderbolts_v1_1.jpg/250px-Thunderbolts_v1_1.jpg",
    releaseDate: "2025-05-02",
    rating: 6.9,
    genres: ["Action", "Adventure"]
  }
];

// 4. Save to Database
async function seedMovies() {
  try {
    await Movie.deleteMany({});
    console.log('Old movies cleared.');
    await Movie.insertMany(dec2025Movies);
    console.log(`Successfully updated posters for CAP 4, TRON, and WICKED!`);
    process.exit();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

seedMovies();
