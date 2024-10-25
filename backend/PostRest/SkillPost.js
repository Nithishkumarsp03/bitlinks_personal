const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 

router.post("/skillpost", authenticate, (req, res) => {
  const { skill } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const query = "INSERT INTO skillset_table (skillset_column) VALUES (?)";
    connection.query(query, [skill], (err, results) => {
      connection.release();

      if (err) {
        console.error("Error inserting role:", err);
        return res.status(500).json({ message: "Error inserting role." });
      }

      return res.json({
        message: "Role inserted successfully.",
        id: results.insertId,
      });
    });
  });
});

module.exports = router; 

/**
 * @swagger
 * /skillpost:
 *   post:
 *     summary: Insert a skill
 *     description: Inserts a new skill into the skillset table in the database.
 *     tags:
 *       - Skills
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skill:
 *                 type: string
 *                 example: "JavaScript"
 *     responses:
 *       200:
 *         description: Skill inserted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Skill inserted successfully."
 *                 id:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error inserting skill."
 */
