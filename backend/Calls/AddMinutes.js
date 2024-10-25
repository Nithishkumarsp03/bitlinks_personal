const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 


router.post( "/addminutes", (req, res) => {
  const {selectedPersonId, username, minutes, deadline, handler} = req.body;

//   console.log('Original data received:', req.body);
    let status = "pending"

  const query = `
    INSERT INTO minutes (person_id, agent, minutes, status, handler, deadline)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  // Execute the SQL query
  pool.query(
    query,
    [
      selectedPersonId,
      username,
      minutes,
      status,
      handler,
      deadline
    ],
    (err, result) => {
      if (err) {
        console.error("Database insert error:", err);
        return res.status(500).json({ message: "Failed to insert record." });
      }

      res
        .status(200)
        .json({
          message: "Record inserted successfully",
          newRecord: result.insertId,
        });
    }
  );
});

module.exports = router; 

/**
 * @swagger
 * /addminutes:
 *   post:
 *     summary: Inserts minutes data for a person
 *     description: Adds a new minutes record in the database for a specific person using their ID.
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
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               minutes:
 *                 type: integer
 *                 example: 30
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-31 23:59:59"
 *     responses:
 *       200:
 *         description: Record inserted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Record inserted successfully
 *                 newRecord:
 *                   type: integer
 *                   example: 101
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to insert record.
 */
