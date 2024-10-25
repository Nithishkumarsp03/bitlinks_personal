const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 


router.get( "/placementdata/:id", (req, res) => {
  const person_id = req.params.id;
  // console.log("This is id:", person_id);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Query to fetch person data based on ID
    connection.query(
      "SELECT * FROM placement WHERE person_id = ?",
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
 * /placementdata/{id}:
 *   get:
 *     summary: Fetches placement data by person ID
 *     description: Retrieves placement information for a specified person ID.
 *     tags:
 *       - Connection
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the person whose placement data is to be fetched.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Placement data fetched successfully
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
 *                   example: "Tech Corp"
 *                 position:
 *                   type: string
 *                   example: "Software Engineer"
 *                 status:
 *                   type: string
 *                   example: "Placed"
 *                 message:
 *                   type: string
 *                   example: "Placement data fetched successfully"
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
