const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 


router.get("/expertisedata/domains", authenticate, (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const query = `
    SELECT
      SUM(CASE WHEN domain = 'Hardware' THEN 1 ELSE 0 END) AS hardwareCount,
      SUM(CASE WHEN domain = 'Software' THEN 1 ELSE 0 END) AS softwareCount,
      SUM(CASE WHEN domain = 'Others' THEN 1 ELSE 0 END) AS othersCount
    FROM expertise
  `;

    connection.query(query, [person_id], (error, results) => {
      connection.release(); // Always release the connection after the query

      if (error) {
        console.error("Error fetching expertise data:", error);
        return res
          .status(500)
          .json({ error: "An error occurred while fetching the data." });
      }

      // If no data is found
      if (results.length === 0) {
        return res.status(404).json({ message: "Person not found." });
      }

      // Send the counts as a JSON response
      res.json({
        hardwareCount: results[0].hardwareCount || 0,
        softwareCount: results[0].softwareCount || 0,
        othersCount: results[0].othersCount || 0,
      });
    });
  });
});
module.exports = router; 
