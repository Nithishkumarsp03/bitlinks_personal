const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 

router.put("/updatestatusrole", (req, res) => {
  const { id, status } = req.body;
  const query = "UPDATE role_table SET status = ? WHERE id = ?";

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    connection.query(query, [status, id], (err, results) => {
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
 * /updatestatusrole:
 *   put:
 *     summary: Update status of a specific role record
 *     description: Updates the status of a specific record in the role table based on its ID.
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
 *               id:
 *                 type: integer
 *                 example: 1
 *               status:
 *                 type: integer
 *                 example: 1
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
 *                   example: "Database error."
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role not found."
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
