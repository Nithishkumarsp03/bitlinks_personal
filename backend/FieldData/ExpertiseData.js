const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 


router.get("/expertisedata/:id", authenticate, (req, res) => {
  const person_id = req.params.id;
  // console.log("This is id:", person_id);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Query to fetch person data based on ID
    connection.query(
      "SELECT * FROM expertise WHERE person_id = ?",
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
 * /expertisedata/{id}:
 *   get:
 *     summary: Fetches Expertise data by person ID
 *     description: Retrieves expertise data based on the provided person ID.
 *     tags:
 *       - Connection
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the person whose expertise data is to be fetched.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Expertise data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 person_id:
 *                   type: integer
 *                   example: 1
 *                 expertise_area:
 *                   type: string
 *                   example: "Software Development"
 *                 experience_years:
 *                   type: integer
 *                   example: 5
 *                 description:
 *                   type: string
 *                   example: "Expert in building scalable web applications."
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
