const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 

router.post("/schedule", authenticate, (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const query = `
    SELECT h.*, p.fullname, p.profile
    FROM history h
    JOIN personalinfo p ON h.person_id = p.person_id
    WHERE h.status = 1
    AND p.useremail = ?
  `;

  pool.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error fetching schedule data:", err);
      res.status(500).send("Server error");
      return;
    }
    res.json(results);
  });
});

module.exports = router; 
