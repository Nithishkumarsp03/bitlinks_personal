const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
router.get("/roledata", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }
    const sql = "SELECT * FROM role_table";
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
 * /roledata:
 *   get:
 *     summary: Fetch Role data
 *     description: Retrieves all records from the role_table.
 *     tags:
 *       - Connection
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Role data fetched successfully
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
 *                   role:
 *                     type: string
 *                     example: "Administrator"
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
