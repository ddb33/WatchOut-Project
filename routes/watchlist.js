const router = require("express").Router();
const User = require("../models/User");
const verify = require("../middleware/verifyToken"); // Assuming this is your middleware path

// WATCHLIST ADD ROUTE
// WATCHLIST GET ROUTE
// GET /api/watchlist
router.get("/", verify, async (req, res) => {
  const userId = req.user.id; 

  try {
    const user = await User.findById(userId, { watchlist: 1 }); // Project only the watchlist field

    if (!user) {
      return res.status(404).json("User not found.");
    }

    res.status(200).json(user.watchlist);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error while fetching watchlist.");
  }
});

// PUT /api/watchlist/add
router.put("/add", verify, async (req, res) => {
  const { movieId } = req.body;
  const userId = req.user.id; // User ID is attached by the verify middleware

  if (!movieId) {
    return res.status(400).json("Movie ID is required.");
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json("User not found.");
    }

    // Check if the movie is already in the watchlist
    if (user.watchlist.includes(movieId)) {
      return res.status(200).json({ message: "Movie already in watchlist." });
    }

    // Add the movie ID to the watchlist array
    user.watchlist.push(movieId);
    await user.save();

    res.status(200).json({ message: "Movie added to watchlist successfully.", watchlist: user.watchlist });
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error during watchlist update.");
  }
});

module.exports = router;

// WATCHLIST REMOVE ROUTE
// DELETE /api/watchlist/remove
router.put("/remove", verify, async (req, res) => {
  const { movieId } = req.body;
  const userId = req.user.id; 

  if (!movieId) {
    return res.status(400).json("Movie ID is required for removal.");
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json("User not found.");
    }

    // Check if the movie is in the watchlist
    if (!user.watchlist.includes(movieId)) {
      return res.status(200).json({ message: "Movie not found in watchlist." });
    }

    // Use Mongoose's $pull operator to remove the movie ID
    await User.updateOne(
      { _id: userId },
      { $pull: { watchlist: movieId } }
    );

    const updatedUser = await User.findById(userId);

    res.status(200).json({ message: "Movie removed successfully.", watchlist: updatedUser.watchlist });
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error during watchlist removal.");
  }
});
