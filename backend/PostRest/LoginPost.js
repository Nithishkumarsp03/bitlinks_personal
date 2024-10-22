const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 

router.post("/loginpost", authenticate, (req, res) => {
  const { name, email, role } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const query = "INSERT INTO login (NAME, EMAIL, ROLE) VALUES (?, ?, ?)";
    connection.query(query, [name, email, role], (err, results) => {
      connection.release();

      if (err) {
        console.error("Error inserting role:", err);
        return res.status(500).json({ message: "Error inserting role." });
      }

      return res.json({
        message: "Login data inserted successfully.",
        id: results.insertId,
      });
    });
  });
});
module.exports = router; 
