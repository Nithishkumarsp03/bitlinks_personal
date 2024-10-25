const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 

router.post("/loginpost", (req, res) => {
  const { name, email, role } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const query = "INSERT INTO login (NAME, EMAIL, ROLE) VALUES (?, ?, ?)";
    connection.query(query, [name, email, role], (err, results) => {
      connection.release();

      if (err) {
        console.error("Error inserting role:", err);
        return res.status(500).json({ message: "Error inserting role." });
      }

      return res.json({
        message: "Login data inserted successfully.",
        id: results.insertId,
      });
    });
  });
});
module.exports = router; 

/**
 * @swagger
 * /loginpost:
 *   post:
 *     summary: Insert login data
 *     description: Inserts the login name and email into the database.
 *     tags:
 *       - Login
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Login data inserted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login data inserted successfully."
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
