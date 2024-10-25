const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 

router.post("/alumnidata", (req, res) => {
  const { person_id } = req.body;
  // console.log("This is internship:", person_id);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Query to fetch person data based on ID
    connection.query(
      "SELECT * FROM alumni WHERE person_id = ?",
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
 * /alumnidata:
 *   post:
 *     summary: Fetches Alumni Data by person ID
 *     description: Retrieves alumni data based on the provided person ID.
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
 *         description: Alumni Data fetched successfully
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
 *                 batch:
 *                   type: string
 *                   example: "2020"
 *                 graduatedyear:
 *                   type: string
 *                   example: "2020"
 *                 phonenumber:
 *                   type: string
 *                   example: "123-456-7890"
 *                 companyaddress:
 *                   type: string
 *                   example: "123 Main St, City, Country"
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
