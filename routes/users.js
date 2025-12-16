const router = require("express").Router();
const User = require("../models/User");
const verify = require("../middleware/verifyToken");
const CryptoJS = require("crypto-js"); // Used to encrypt password if user changes it
const bcrypt = require("bcryptjs"); // Used for hashing and salting

// UPDATE USER ROUTE
// PUT /api/users/:id
router.put("/:id", verify, async (req, res) => {
  // Check if the authenticated user ID matches the ID in the URL, OR if the user is an admin
  if (req.user.id === req.params.id || req.user.isAdmin) {
    
    // --- Password Hashing Logic ---
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body, // Use $set to update only the fields provided in req.body
        },
        { new: true } // Return the updated document
      );

      // Exclude the password from the response for security
      const { password, ...info } = updatedUser._doc;

      res.status(200).json(info);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can update only your own account!");
  }
});

module.exports = router;

// DELETE USER ROUTE
// DELETE /api/users/:id
router.delete("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);

      res.status(200).json("User has been deleted...");
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can delete only your own account!");
  }
});

// GET USER ROUTE (by ID)
// GET /api/users/find/:id
router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    // Securely destructure to exclude sensitive fields
    const { password, isAdmin, ...info } = user._doc;

    res.status(200).json(info);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});
