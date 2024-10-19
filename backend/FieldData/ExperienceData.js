
const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 
router.post( "/experiencedata", authenticate, (req, res) => {
  const { person_id } = req.body;
  // console.log("Fetching experience data for ID:", person_id);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Query to fetch experience data based on ID
    connection.query(
      "SELECT * FROM previousexperience WHERE person_id = ?",
      [person_id],
      (error, results) => {
        connection.release(); // Always release the connection after the query

        if (error) {
          console.error("Error fetching experience data:", error);
          return res
            .status(500)
            .json({ error: "An error occurred while fetching the data." });
        }

        // If no data is found
        if (results.length === 0) {
          return res
            .status(404)
            .json({ message: "Experience data not found." });
        }

        res.json(results[0]);
      }
    );
  });
});

module.exports = router; 

