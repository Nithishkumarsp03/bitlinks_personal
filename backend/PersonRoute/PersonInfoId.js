const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 
router.get("/personalinfo/main/:personId", authenticate, (req, res) => {
  const { personId } = req.params;

  const query = "SELECT * FROM personalinfo WHERE person_id = ?";

  pool.query(query, [personId], (error, results) => {
    if (error) {
      console.error("Error fetching main connection:", error);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results[0]); // Return the first (and only) result
  });
});

// API to fetch sub-connections (entries where sub_id = selectedPersonId)
router.get(
   "/personalinfo/subconnections/:personId",
  authenticate,
  (req, res) => {
    const { personId } = req.params;

    const query = `SELECT personalinfo.*, person_points_summary.*
                FROM personalinfo
                LEFT JOIN person_points_summary 
                ON personalinfo.person_id = person_points_summary.person_id
                WHERE personalinfo.sub_id = ?`;

    pool.query(query, [personId], (error, results) => {
      if (error) {
        console.error("Error fetching sub-connections:", error);
        return res.status(500).json({ message: "Database error" });
      }
      res.json(results); // Return all matching results
    });
  }
);

module.exports = router; 
