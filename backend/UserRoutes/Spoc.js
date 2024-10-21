const express = require("express");
const router = express.Router();
const pool = require("../config.js");
const authenticate = require("../Authenticate.js");

router.get("/spoc", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }
    
    const query = `SELECT * FROM personalinfo WHERE spoc = "yes"`;
    connection.query(query, (err, results) => {
      // Release the connection back to the pool
      connection.release();
      
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ message: "Failed to fetch data" });
      }
      
      // Send the fetched results as a JSON response
      res.status(200).json(results);
    });
  });
});

module.exports = router;
