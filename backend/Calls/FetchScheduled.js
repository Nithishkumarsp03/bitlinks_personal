const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 

router.get("/fetch-scheduled", authenticate, (req, res) => {
  const query = `SELECT h.*, p.*
                FROM history h
                JOIN personalinfo p ON h.person_id = p.person_id
                WHERE h.status = 1;
                `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching scheduled data:", err);
      return res.status(500).send("Server error");
    }
    res.json(results);
  });
});


module.exports = router; 
