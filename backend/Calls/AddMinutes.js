const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 


router.post( "/addminutes", authenticate, (req, res) => {
  const {selectedPersonId, username, minutes, deadline, handler} = req.body;

//   console.log('Original data received:', req.body);
    let status = "pending"

  const query = `
    INSERT INTO minutes (person_id, agent, minutes, status, handler, deadline)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  // Execute the SQL query
  pool.query(
    query,
    [
      selectedPersonId,
      username,
      minutes,
      status,
      handler,
      deadline
    ],
    (err, result) => {
      if (err) {
        console.error("Database insert error:", err);
        return res.status(500).json({ message: "Failed to insert record." });
      }

      res
        .status(200)
        .json({
          message: "Record inserted successfully",
          newRecord: result.insertId,
        });
    }
  );
});

module.exports = router; 
