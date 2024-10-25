const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 

router.post("/history",(req, res) => {
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

/**
 * @swagger
 * /history:
 *   post:
 *     summary: Fetches history data for a specific person
 *     description: Retrieves history records for a given person ID and counts the total records.
 *     tags:
 *       - Connection
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               selectedPersonId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Records fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       history_id:
 *                         type: integer
 *                         example: 101
 *                       person_id:
 *                         type: integer
 *                         example: 1
 *                       agent:
 *                         type: string
 *                         example: "john_doe"
 *                       note:
 *                         type: string
 *                         example: "Sample note"
 *                       scheduleddate:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-31T15:30:00Z"
 *                       status:
 *                         type: integer
 *                         example: 1
 *                 totalCount:
 *                   type: integer
 *                   example: 5
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: selectedPersonId is required
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Database error
 */
