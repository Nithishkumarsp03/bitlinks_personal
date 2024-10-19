const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 


router.put("/outcomeupload", authenticate, (req, res) => {
  const { selectedPersonId, Outcomeinfo, Outcome_Completion } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const sql = `UPDATE outcome
        SET eventname = ?, date = ?, description = ?, Outcome_Completion = ?
        WHERE person_id = ?`;

    connection.query(
      sql,
      [
        Outcomeinfo.eventname,
        Outcomeinfo.date,
        Outcomeinfo.description,
        Outcome_Completion,
        selectedPersonId,
      ],
      (err, results) => {
        connection.release();

        if (err) {
          console.error("Error updating person data:", err);
          return res
            .status(500)
            .json({ error: "An error occurred while updating the data." });
        }

        res.status(200).json({ message: "Updated successfully!" });
      }
    );
  });
});

module.exports = router; 
