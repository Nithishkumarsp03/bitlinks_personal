const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 
router.post("/personstatus", authenticate, (req, res) => {
  const { person, reason, status } = req.body;
  // console.log(req.body);
  const query = `UPDATE personalinfo
                  SET status = ?, 
                      reason = ?
                  WHERE person_id = ?;`;
  pool.query(query, [status, reason, person], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Failed to update status" });
    }
    res.status(200);
  });
});

module.exports = router; 
