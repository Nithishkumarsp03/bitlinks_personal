const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
router.get("/interactions", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }
    const sql = "SELECT * FROM interactions";
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
 * /interactions:
 *   get:
 *     summary: Fetch Interaction Data
 *     description: Retrieves interaction data from the interactions table.
 *     tags:
 *       - Connection
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Interaction data fetched successfully
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
 *                   interaction_type:
 *                     type: string
 *                     example: "message"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-01-01T12:00:00Z"
 *                   # Add other relevant fields as necessary
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
