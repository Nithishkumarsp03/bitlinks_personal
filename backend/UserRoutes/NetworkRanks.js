const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
router.post("/networkranks",(req, res) => {
  const query = `
    SELECT
      COUNT(CASE WHEN pps.rank = 3 THEN 1 END) AS count_rank_3,
      COUNT(CASE WHEN pps.rank = 2 THEN 1 END) AS count_rank_2,
      COUNT(CASE WHEN pps.rank = 1 THEN 1 END) AS count_rank_1,
      COUNT(CASE WHEN pps.rank = 0 THEN 1 END) AS count_rank_0,
      COUNT(CASE WHEN pps.rank = -1 THEN 1 END) AS count_rank_minus
    FROM person_points_summary pps
    JOIN personalinfo p ON pps.person_id = p.person_id
  `;

  pool.query(query, (err, results) => {
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
 * /networkranks:
 *   post:
 *     summary: Fetch network ranks of users
 *     description: Retrieves the counts of users by their ranks in the network.
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
 *               name:
 *                 type: string
 *                 example: NetworkRanks
 *     responses:
 *       200:
 *         description: Network ranks fetched successfully
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
 *                   example: 10
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
