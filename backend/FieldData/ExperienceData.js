
const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
router.post( "/experiencedata", (req, res) => {
  const { person_id } = req.body;
  // console.log("Fetching experience data for ID:", person_id);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Query to fetch experience data based on ID
    connection.query(
      "SELECT * FROM previousexperience WHERE person_id = ?",
      [person_id],
      (error, results) => {
        connection.release(); // Always release the connection after the query

        if (error) {
          console.error("Error fetching experience data:", error);
          return res
            .status(500)
            .json({ error: "An error occurred while fetching the data." });
        }

        // If no data is found
        if (results.length === 0) {
          return res
            .status(404)
            .json({ message: "Experience data not found." });
        }

        res.json(results[0]);
      }
    );
  });
});

module.exports = router; 

/**
 * @swagger
 * /experiencedata:
 *   post:
 *     summary: Fetches Experience data by person ID
 *     description: Retrieves experience data based on the provided person ID.
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
 *         description: Experience data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 person_id:
 *                   type: integer
 *                   example: 1
 *                 company_name:
 *                   type: string
 *                   example: "ABC Corp"
 *                 position:
 *                   type: string
 *                   example: "Software Engineer"
 *                 duration:
 *                   type: string
 *                   example: "2 years"
 *                 responsibilities:
 *                   type: string
 *                   example: "Developed web applications"
 * 
 *       404:
 *         description: Experience data not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Experience data not found."
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
