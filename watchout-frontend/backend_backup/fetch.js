const axios = require('axios');
const fs = require('fs');

// Your TMDB API Key
const apiKey = '0fe3133595252f07c96220d4833513ad'; 

const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`;

console.log("Attempting to download movies from TMDB...");

axios.get(url)
  .then(response => {
    const rawMovies = response.data.results;
    
    // Transform the data to match our schema
    const myMovies = rawMovies.map(m => ({
      title: m.title,
      releaseDate: m.release_date,
      genre: "Movie", // Simplified genre
      description: m.overview,
      rating: m.vote_average,
      posterPath: "https://image.tmdb.org/t/p/w500" + m.poster_path
    }));

    // SAVE TO FILE ONLY (No database connection here)
    fs.writeFileSync('movies.json', JSON.stringify(myMovies, null, 2));
    console.log(`Success! Saved ${myMovies.length} movies to 'movies.json'.`);
  })
  .catch(err => {
    console.error("Download failed! (Ensure VM is set to NAT)");
    console.error("Error:", err.message);
  });
