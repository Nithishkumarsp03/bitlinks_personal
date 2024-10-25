const express = require("express");
const router = express.Router();
const pool = require("../config.js");  

router.post("/rolepost", (req, res) => {
  const { role } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const query = "INSERT INTO role_table (role_column) VALUES (?)";
    connection.query(query, [role], (err, results) => {
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
 * /rolepost:
 *   post:
 *     summary: Insert a role
 *     description: Inserts a new role into the role table in the database.
 *     tags:
 *       - Role
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 example: "Admin"
 *     responses:
 *       200:
 *         description: Role inserted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role inserted successfully."
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
 *                   example: "Error inserting role."
 */
