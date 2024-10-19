const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js");

router.post("/history", authenticate, (req, res) => {
  const { selectedPersonId } = req.body;

  // Proceed with the rest of the logic without token verification
  if (!selectedPersonId) {
    return res.status(400).json({ message: "selectedPersonId is required" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Fetch the history records
    const sql =
      "SELECT * FROM history WHERE person_id = ? ORDER BY history_id DESC";
    connection.query(sql, [selectedPersonId], async (err, results) => {
      if (err) {
        connection.release();
        console.error("Error executing database query:", err);
        return res.status(500).json({ message: "Database error" });
      }

      // If no records found, respond with a 404 status
      // if (results.length === 0) {
      //   connection.release();
      //   return res.status(404).json({ message: "No data found for the given person_id" });
      // }

      // Count the total number of records
      const countSql =
        "SELECT COUNT(*) AS totalCount FROM history WHERE person_id = ?";
      connection.query(
        countSql,
        [selectedPersonId],
        async (err, countResult) => {
          connection.release();

          if (err) {
            console.error("Error executing count query:", err);
            return res.status(500).json({ message: "Database error" });
          }

          const totalCount = countResult[0].totalCount;

          // Send the records and the count in the response
          res.json({ data: results, totalCount });
          // console.log("Fetched Data:", results);
        }
      );
    });
  });
});

module.exports = router;
