const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 

router.post("/history-status", authenticate, (req, res) => {
  const { history_id, status } = req.body;

  if (!history_id || typeof status === "undefined") {
    return res
      .status(400)
      .json({ error: "Missing required fields: history_id and status" });
  }

  const query = "UPDATE history SET status = ? WHERE history_id = ?";

  pool.query(query, [status, history_id], (err, result) => {
    if (err) {
      console.error("Error updating history status:", err);
      return res.status(500).json({ error: "Failed to update history status" });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "No history record found with the given ID" });
    }

    res.status(200).json({ message: "History status updated successfully" });
  });
});

router.post("/history-status", authenticate, (req, res) => {
  const { history_id, status } = req.body;

  if (!history_id || typeof status === "undefined") {
    return res
      .status(400)
      .json({ error: "Missing required fields: history_id and status" });
  }

  const query = "UPDATE history SET status = ? WHERE history_id = ?";

  pool.query(query, [status, history_id], (err, result) => {
    if (err) {
      console.error("Error updating history status:", err);
      return res.status(500).json({ error: "Failed to update history status" });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "No history record found with the given ID" });
    }

    res.status(200).json({ message: "History status updated successfully" });
  });
});


module.exports = router; 
