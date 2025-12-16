const router = require("express").Router();
const Movie = require("../models/Movie");
const verify = require("../middleware/verifyToken");

// CREATE MOVIE/SERIES ROUTE
// POST /api/movies
router.post("/", verify, async (req, res) => {
  // --- Security Check: Only Admins can create content ---
  if (req.user.isAdmin) {
    const newMovie = new Movie(req.body);

    try {
      const savedMovie = await newMovie.save();
      res.status(201).json(savedMovie);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  } else {
    // 403 Forbidden status if not an admin
    res.status(403).json("You are not allowed to add content!");
  }
});

module.exports = router;

// UPDATE MOVIE/SERIES ROUTE
// PUT /api/movies/:id
router.put("/:id", verify, async (req, res) => {
  // --- Security Check: Only Admins can update content ---
  if (req.user.isAdmin) {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true } // Return the updated document
      );
      res.status(200).json(updatedMovie);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed to update content!");
  }
});

// DELETE MOVIE/SERIES ROUTE
// DELETE /api/movies/:id
router.delete("/:id", verify, async (req, res) => {
  // --- Security Check: Only Admins can delete content ---
  if (req.user.isAdmin) {
    try {
      await Movie.findByIdAndDelete(req.params.id);
      res.status(200).json("The movie has been deleted...");
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed to delete content!");
  }
});

// GET SPECIFIC MOVIE/SERIES ROUTE
// GET /api/movies/find/:id
router.get("/find/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.status(200).json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// GET RANDOM MOVIE/SERIES ROUTE
// GET /api/movies/random?type=series|movie
router.get("/random", async (req, res) => {
  const type = req.query.type;
  let movie;

  try {
    if (type === "series") {
      // Find one random document where isSeries is true
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      // Find one random document where isSeries is false (i.e., a movie)
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }

    res.status(200).json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// GET ALL MOVIES/SERIES ROUTE (ADMIN ONLY)
// GET /api/movies
router.get("/", verify, async (req, res) => {
  // --- Security Check: Only Admins can view all content ---
  if (req.user.isAdmin) {
    try {
      // Fetch all movies/series, newest first
      const movies = await Movie.find().sort({ createdAt: -1 }); 
      res.status(200).json(movies);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed to view all content!");
  }
});

module.exports = router;
