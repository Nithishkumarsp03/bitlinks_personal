const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 

router.post("/skillpost", authenticate, (req, res) => {
  const { skill } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const query = "INSERT INTO skillset_table (skillset_column) VALUES (?)";
    connection.query(query, [skill], (err, results) => {
      connection.release();

      if (err) {
        console.error("Error inserting role:", err);
        return res.status(500).json({ message: "Error inserting role." });
      }

      return res.json({
        message: "Role inserted successfully.",
        id: results.insertId,
      });
    });
  });
});

module.exports = router; 
