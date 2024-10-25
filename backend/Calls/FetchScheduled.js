const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 

router.get("/fetch-scheduled", (req, res) => {
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

/**
 * @swagger
 * /fetch-scheduled:
 *   get:
 *     summary: Fetches scheduled data
 *     description: Retrieves scheduled data from the history and personal information tables.
 *     tags:
 *       - Connection
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Records fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   person_id:
 *                     type: integer
 *                     example: 1
 *                   scheduleddate:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-12-31 15:30:00"
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   email:
 *                     type: string
 *                     example: "john.doe@example.com"
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
