const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 


router.post("/outcomedata", authenticate, (req, res) => {
  const { person_id } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Query to fetch person data based on ID
    connection.query(
      "SELECT * FROM outcome WHERE person_id = ?",
      [person_id],
      (error, results) => {
        connection.release(); // Always release the connection after the query

        if (error) {
          console.error("Error fetching person data:", error);
          res
            .status(500)
            .json({ error: "An error occurred while fetching the data." });
          return;
        }

        // If no data is found
        if (results.length === 0) {
          res.status(404).json({ message: "Person not found." });
          return;
        }

        res.json(results[0]);
      }
    );
  });
});

module.exports = router; 

/**
 * @swagger
 * /outcomedata:
 *   post:
 *     summary: Fetches outcome data by person ID
 *     description: Retrieves outcome data associated with a specific person ID.
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
 *               person_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Outcome data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 outcome_id:
 *                   type: integer
 *                   example: 201
 *                 description:
 *                   type: string
 *                   example: "Completed internship with Tech Solutions."
 *                 status:
 *                   type: string
 *                   example: "Achieved"
 *
 *       404:
 *         description: Person ID not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Person not found."
 * 
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Database error"
 */
