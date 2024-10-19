const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 
router.post("/domainpost", authenticate, (req, res) => {
  const { domain } = req.body;
  // console.log(req.body);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }
    const query = "INSERT INTO domain_table (domain_column) VALUES (?)";
    connection.query(query, [domain], (err, results) => {
      connection.release();
      if (err) {
        console.error("Error updating status:", err);
        return results.status(500).json({ message: "Error updating status." });
      }
      // results.json({ message: 'Status updated successfully.' });
    });
  });
});


module.exports = router; 
