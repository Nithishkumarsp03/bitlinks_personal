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

        const newdate = Outcomeinfo.date;

        // Check if newdate is null or undefined
        let dateFormatted = null; // Default to null
        if (newdate) {
          dateFormatted = newdate.split("T")[0]; // Format the date
        } else {
          return res.status(400).json({ error: "Date is required." }); // Return error if date is not provided
        }

    connection.query(
      sql,
      [
        Outcomeinfo.eventname,
        dateFormatted,
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
