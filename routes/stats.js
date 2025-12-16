const router = require("express").Router();
const User = require("../models/User");
const verify = require("../middleware/verifyToken");

// GET USER STATISTICS ROUTE (ADMIN ONLY)
// GET /api/stats/users
router.get("/users", verify, async (req, res) => {
  // --- Security Check: Only Admins can view statistics ---
  if (req.user.isAdmin) {
    const today = new Date();
    const lastYear = today.setFullYear(today.getFullYear() - 1);

    try {
      const data = await User.aggregate([
        // 1. Filter: Match users created since the start of last year
        {
          $match: { createdAt: { $gte: lastYear } },
        },
        // 2. Projection: Extract the month number from the createdAt date
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        // 3. Grouping: Group by the month number and count the total users in that month
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
        // 4. Sorting: Sort the results by month
        {
          $sort: { _id: 1 }
        }
      ]);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not authorized to view statistics!");
  }
});

module.exports = router;

