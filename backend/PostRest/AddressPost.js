const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 

router.post("/addresspost", authenticate, (req, res) => {
  const { location } = req.body;
  // console.log(req.body);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }
    const query = "INSERT INTO address_table (address_column) VALUES (?)";
    connection.query(query, [location], (err, results) => {
      connection.release();
      if (err) {
        console.error("Error updating status:", err);
        return res.status(500).json({ message: "Error updating status." });
      }
      // results.json({ message: 'Status updated successfully.' });
    });
  });
});
module.exports = router; 
