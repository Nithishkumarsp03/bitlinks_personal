const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 

console.log("check connection");
/**
 * @swagger
 * /check-connection:
 *   post:
 *     summary: Check the connection status of a person
 *     description: Check if a person's name exists in the database by full name.
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
 *               name:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       200:
 *         description: Person found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: found
 *       401:
 *         description: Person not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: notfound
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Database error
 */
router.post("/check-connection", (req, res) => {
  // console.log("check connection");
  const { name } = req.body;
  const normalizedName = name.trim().toLowerCase(); 

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }
    connection.query(
      "SELECT * FROM personalinfo WHERE LOWER(fullname) = ?",
      [normalizedName],
      (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing database query:", err);
          return res.status(500).json({ message: "Database error" });
        }

        if (results.length > 0) {
          res.status(200).json({ message: "found" });
        } else {
          res.status(401).json({ message: "notfound" });
        }
      }
    );
  });
});

module.exports = router; 
