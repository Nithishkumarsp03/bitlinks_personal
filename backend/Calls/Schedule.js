const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 

router.post("/schedule", authenticate, (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const query = `
    SELECT h.*, p.fullname, p.profile
    FROM history h
    JOIN personalinfo p ON h.person_id = p.person_id
    WHERE h.status = 1
    AND p.useremail = ?
  `;

  pool.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error fetching schedule data:", err);
      res.status(500).send("Server error");
      return;
    }
    res.json(results);
  });
});

module.exports = router; 

/**
 * @swagger
 * /schedule:
 *   post:
 *     summary: Fetches schedules by user email
 *     description: Retrieves scheduled history records based on the user's email.
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
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Schedules fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   history_id:
 *                     type: integer
 *                     example: 101
 *                   person_id:
 *                     type: integer
 *                     example: 1
 *                   fullname:
 *                     type: string
 *                     example: "John Doe"
 *                   profile:
 *                     type: string
 *                     example: "path/to/profile.jpg"
 *                   status:
 *                     type: integer
 *                     example: 1
 *                   other_properties:
 *                     type: string
 *                     example: "other values"
 *       400:
 *         description: Email is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email is required
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
