const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 

router.get("/persondata/:id", authenticate, (req, res) => {
  const person_id = req.params.id;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    connection.query(
      `SELECT * 
      FROM personalinfo 
      INNER JOIN person_points_summary 
      ON personalinfo.person_id = person_points_summary.person_id
      WHERE personalinfo.person_id = ?;`,
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
        // if (results.length === 0) {
        //   res.status(404).json({ message: "Person not found." });
        //   return;
        // }

        res.json(results[0]);
      }
    );
  });
});

module.exports = router; 

/**
 * @swagger
 * /persondata/{id}:
 *   get:
 *     summary: Fetches person data for points summary by person ID
 *     description: Retrieves personal information along with points summary for a specified person ID.
 *     tags:
 *       - Connection
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the person whose data is to be fetched.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Person data for points summary fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 person_id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *                 points:
 *                   type: integer
 *                   example: 150
 *                 message:
 *                   type: string
 *                   example: "Person data fetched successfully"
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
