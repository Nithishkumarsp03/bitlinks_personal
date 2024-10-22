const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 

router.get("/personalinfo/main/:personId", authenticate, (req, res) => {
  const { personId } = req.params;

  const query = "SELECT * FROM personalinfo WHERE person_id = ?";

  pool.query(query, [personId], (error, results) => {
    if (error) {
      console.error("Error fetching main connection:", error);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results[0]); // Return the first (and only) result
  });
});

// API to fetch sub-connections (entries where sub_id = selectedPersonId)
router.get(
   "/personalinfo/subconnections/:personId",
  authenticate,
  (req, res) => {
    const { personId } = req.params;

    const query = `SELECT personalinfo.*, person_points_summary.*
                FROM personalinfo
                LEFT JOIN person_points_summary 
                ON personalinfo.person_id = person_points_summary.person_id
                WHERE personalinfo.sub_id = ?`;

    pool.query(query, [personId], (error, results) => {
      if (error) {
        console.error("Error fetching sub-connections:", error);
        return res.status(500).json({ message: "Database error" });
      }
      res.json(results); // Return all matching results
    });
  }
);

module.exports = router; 

/**
 * @swagger
 * /personalinfo/main/{personId}:
 *   get:
 *     summary: Fetch connections of a person based on ID
 *     description: Fetch personal connections of a person using their ID.
 *     tags:
 *       - Connection
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: personId
 *         required: true
 *         description: ID of the person to fetch connections for.
 *         schema:
 *           type: string
 *           example: "12345"
 *     responses:
 *       200:
 *         description: Personal connections fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Personal connections fetched successfully
 *                 data:
 *                   type: object
 *                   additionalProperties: true
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

/**
 * @swagger
 * /personalinfo/subconnections/{personId}:
 *   get:
 *     summary: Fetch sub-connections of a person based on ID
 *     description: Fetch sub-connections for a specific person using their ID.
 *     tags:
 *       - Connection
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: personId
 *         required: true
 *         description: ID of the person to fetch sub-connections for.
 *         schema:
 *           type: string
 *           example: "12345"
 *     responses:
 *       200:
 *         description: Sub-connections fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 additionalProperties: true
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
