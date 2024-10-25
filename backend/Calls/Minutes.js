const express = require("express");
const router = express.Router();
const pool = require("../config.js");

router.post("/minutes",(req, res) => {
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

/**
 * @swagger
 * /minutes:
 *   post:
 *     summary: Fetches minutes by person ID
 *     description: Retrieves minutes records for a given person ID.
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
 *         description: Minutes fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   minute_id:
 *                     type: integer
 *                     example: 101
 *                   person_id:
 *                     type: integer
 *                     example: 1
 *                   agent:
 *                     type: string
 *                     example: "john_doe"
 *                   minutes:
 *                     type: string
 *                     example: "Reviewed project updates."
 *                   status:
 *                     type: string
 *                     example: "pending"
 *                   deadline:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-12-31T15:30:00Z"
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */
