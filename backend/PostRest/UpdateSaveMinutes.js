const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 

router.put( "/updatesaveminutes", authenticate, (req, res) => {
  const { id, minutes, deadline, handler } = req.body;
//   console.log(req.body)
  const query = "UPDATE minutes SET minutes = ?, deadline = ?, handler = ? WHERE id = ?";

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    connection.query(query, [minutes, deadline, handler, id], (err, results) => {
      connection.release(); // Release the connection back to the pool
      if (err) {
        console.error("Error updating status:", err);
        return res.status(500).json({ message: "Error updating status." });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Address not found." });
      } else {
        res.json({ message: "Status updated successfully." });
      }
    });
  });
});

module.exports = router; 
