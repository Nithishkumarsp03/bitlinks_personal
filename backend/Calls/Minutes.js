const express = require("express");
const router = express.Router();
const pool = require("../config.js");
const authenticate = require("../Authenticate.js");

router.post("/minutes",authenticate, (req, res) => {
  const { selectedPersonId } = req.body;
  const query = `SELECT * from minutes WHERE person_id = ? ORDER BY id DESC`;

  pool.query(query, [selectedPersonId], (err, results) => {
    if (err) {
      console.error("Error fetching scheduled data:", err); 
      return res.status(500).send("Server error");
    }
    res.json(results);
  });
});

module.exports = router;
