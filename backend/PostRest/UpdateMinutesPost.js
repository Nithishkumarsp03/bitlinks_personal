const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 

router.put( "/updateminutes", authenticate, (req, res) => {
  const { id, newStatus, comment } = req.body;
  const query = "UPDATE minutes SET status = ?, comments = ? WHERE id = ?";

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    connection.query(query, [newStatus, comment, id], (err, results) => {
      connection.release(); // Release the connection back to the pool
      if (err) {
        console.error("Error updating status:", err);
        return res.status(500).json({ message: "Error updating status." });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Address not found." });
      } else {
        res.json({ message: "Status updated successfully." });
      }
    });
  });
});

module.exports = router; 

/**
 * @swagger
 * /updateminutes:
 *   put:
 *     summary: Update status and comments of a minutes record
 *     description: Updates the status and comments of a specific record in the minutes table based on its ID.
 *     tags:
 *       - Minutes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               newStatus:
 *                 type: integer
 *                 example: 1
 *               comment:
 *                 type: string
 *                 example: "Updated the status to reflect the current situation."
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Status updated successfully."
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Database error"
 *       404:
 *         description: Record not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Address not found."
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating status."
 */
