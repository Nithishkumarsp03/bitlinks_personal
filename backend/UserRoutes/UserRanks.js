const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 

router.post("/userranks", (req, res) => {
  const { email } = req.body; // Assuming email is passed as a query parameter

  const query = `
    SELECT
      COUNT(CASE WHEN pps.rank = 3 THEN 1 END) AS count_rank_3,
      COUNT(CASE WHEN pps.rank = 2 THEN 1 END) AS count_rank_2,
      COUNT(CASE WHEN pps.rank = 1 THEN 1 END) AS count_rank_1,
      COUNT(CASE WHEN pps.rank = 0 THEN 1 END) AS count_rank_0
    FROM person_points_summary pps
    LEFT JOIN personalinfo p ON pps.person_id = p.person_id
    WHERE p.useremail = ?;
  `;

  pool.query(query, [email], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch user ranks counts." });
    }

    // Extract counts from results
    const counts = results[0] || {};

    res.status(200).json(counts);
  });
});

module.exports = router; 
