const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 

const moment = require("moment-timezone");

// Example timezone you want to use, e.g., 'Asia/Kolkata'
const timezone = "Asia/Kolkata";

router.post( "/addhistory", authenticate, (req, res) => {
  const {
    selectedPersonId,
    username,
    email,
    type,
    note,
    purpose,
    points,
    scheduled_date,
    imagePath1,
    imagePath2,
    status,
  } = req.body;

  // console.log('Original data received:', req.body);

  // Format the provided scheduled_date to MySQL datetime format with the correct timezone
  const formattedDate = moment(scheduled_date).format("YYYY-MM-DD HH:mm:ss");

  // console.log("Formatted date: ", formattedDate);

  // Prepare the SQL query
  const query = `
    INSERT INTO history (person_id, agent, email, type, note, purpose, scheduleddate, visited1, visited2, points, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Execute the SQL query
  pool.query(
    query,
    [
      selectedPersonId,
      username,
      email,
      type,
      note,
      purpose,
      formattedDate,
      imagePath1,
      imagePath2,
      points,
      status,
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
