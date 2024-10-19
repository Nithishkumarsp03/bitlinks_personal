const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 


router.post("/update-status", authenticate, (req, res) => {
  const { history_id } = req.body; // Get the history_id from the request body

  if (!history_id) {
    return res.status(400).json({ message: "History ID is required" });
  }

  const query = "UPDATE history SET status = 0 WHERE history_id = ?";

  pool.query(query, [history_id], (err, result) => {
    if (err) {
      console.error("Database update error:", err);
      return res.status(500).json({ message: "Failed to update status" });
    }

    res.status(200).json({ message: "Status updated successfully" });
  });
});
router.post("/update-status", authenticate, (req, res) => {
  const { history_id, status } = req.body;

  if (!history_id || status === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = "UPDATE history SET status = ? WHERE history_id = ?";
  pool.query(query, [status, history_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update status" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json({ message: "Status updated successfully" });
  });
});

module.exports = router; 
