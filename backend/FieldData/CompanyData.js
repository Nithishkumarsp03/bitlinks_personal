
const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
router.post("/companydata",(req, res) => {
  const { person_id } = req.body;
  // console.log("This is id:", person_id);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Query to fetch person data based on ID
    connection.query(
      "SELECT * FROM company WHERE person_id = ?",
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
 * /companydata:
 *   post:
 *     summary: Fetches Company Data by person ID
 *     description: Retrieves company data based on the provided person ID.
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
 *         description: Company Data fetched successfully
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
 *                   example: "Tech Innovations Ltd"
 *                 position:
 *                   type: string
 *                   example: "Software Engineer"
 *                 years_active:
 *                   type: integer
 *                   example: 3
 *                 other_properties:
 *                   type: string
 *                   example: "other values"
 *
 *       404:
 *         description: Person not found
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
