const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 
router.get("/logindata", authenticate, (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }
    const sql = "SELECT * FROM login";
    connection.query(sql, (err, results) => {
      connection.release();
      if (err) {
        console.error("Error executing database query:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json(results);
    });
  });
});

module.exports = router; 


/**
 * @swagger
 * /logindata:
 *   get:
 *     summary: Fetch login data
 *     description: Retrieves all records from the login table.
 *     tags:
 *       - Connection
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Login data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   email:
 *                     type: string
 *                     example: "john.doe@example.com"
 *                   status:
 *                     type: integer
 *                     example: 1
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-01-01T00:00:00Z"
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-01-01T00:00:00Z"
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
