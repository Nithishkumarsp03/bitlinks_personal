const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 

router.post("/userranks", (req, res) => {
  const { email } = req.body; // Assuming email is passed as a query parameter

  const query = `
    SELECT
      COUNT(CASE WHEN pps.rank = 3 THEN 1 END) AS count_rank_3,
      COUNT(CASE WHEN pps.rank = 2 THEN 1 END) AS count_rank_2,
      COUNT(CASE WHEN pps.rank = 1 THEN 1 END) AS count_rank_1,
      COUNT(CASE WHEN pps.rank = 0 THEN 1 END) AS count_rank_0,
      COUNT(CASE WHEN pps.rank = -1 THEN 1 END) AS count_rank_minus
    FROM person_points_summary pps
    LEFT JOIN personalinfo p ON pps.person_id = p.person_id
    WHERE p.useremail = ?;
  `;

  pool.query(query, [email], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch user ranks counts." });
    }

    // Extract counts from results
    const counts = results[0] || {};

    res.status(200).json(counts);
  });
});

module.exports = router; 

/**
 * @swagger
 * /userranks:
 *   post:
 *     summary: Fetch user ranks data based on email
 *     description: Retrieves the count of user ranks (3, 2, 1, 0, -1) for a specific user identified by their email.
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
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: User ranks data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count_rank_3:
 *                   type: integer
 *                   example: 5
 *                 count_rank_2:
 *                   type: integer
 *                   example: 3
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch user ranks counts."
 */
