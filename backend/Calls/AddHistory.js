const express = require("express");
const router = express.Router();
const pool = require("../config.js");

const moment = require("moment-timezone");

// Example timezone you want to use, e.g., 'Asia/Kolkata'
const timezone = "Asia/Kolkata";

router.post( "/addhistory", (req, res) => {
  const {
    selectedPersonId,
    username,
    email,
    type,
    note,
    purpose,
    points,
    scheduled_date,
    imagePath1,
    imagePath2,
    status,
  } = req.body;

  // console.log('Original data received:', req.body);

  let formattedDate;

  // Format the provided scheduled_date to MySQL datetime format with the correct timezone
  if (type === "Visited") {
    const currentDate = moment();  // Get the current date
    formattedDate = currentDate.add(2, 'days').format("YYYY-MM-DD HH:mm:ss");  // Add 2 days and format it
    // console.log("Scheduled Date (2 days later):", formattedDate);
  } else {
    formattedDate = moment(scheduled_date).format("YYYY-MM-DD HH:mm:ss");
    // console.log("Scheduled Date:", formattedDate);
  }
  

  // console.log("Formatted date: ", formattedDate);

  // Prepare the SQL query
  const query = `
    INSERT INTO history (person_id, agent, email, type, note, purpose, scheduleddate, visited1, visited2, points, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(
    query,
    [
      selectedPersonId,
      username,
      email,
      type,
      note,
      purpose,
      formattedDate,
      imagePath1,
      imagePath2,
      points,
      status,
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
 * /addhistory:
 *   post:
 *     summary: Inserts a history record for a person
 *     description: Adds a new history record in the database for a specific person using their ID.
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
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               type:
 *                 type: string
 *                 example: "type_example"
 *               note:
 *                 type: string
 *                 example: "This is a sample note"
 *               purpose:
 *                 type: string
 *                 example: "meeting"
 *               points:
 *                 type: integer
 *                 example: 10
 *               scheduled_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-31 15:30:00"
 *               imagePath1:
 *                 type: string
 *                 example: "/uploads/image1.jpg"
 *               imagePath2:
 *                 type: string
 *                 example: "/uploads/image2.jpg"
 *               status:
 *                 type: string
 *                 example: "completed"
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
