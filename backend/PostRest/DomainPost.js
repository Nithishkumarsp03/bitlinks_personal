const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
router.post("/domainpost", (req, res) => {
  const { domain } = req.body;
  // console.log(req.body);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }
    const query = "INSERT INTO domain_table (domain_column) VALUES (?)";
    connection.query(query, [domain], (err, results) => {
      connection.release();
      if (err) {
        console.error("Error updating status:", err);
        return results.status(500).json({ message: "Error updating status." });
      }
      // results.json({ message: 'Status updated successfully.' });
    });
  });
});


module.exports = router; 

/**
 * @swagger
 * /domainpost:
 *   post:
 *     summary: Add Domain data
 *     description: Inserts a new domain entry into the domain table.
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
 *               domain:
 *                 type: string
 *                 example: "example.com"
 *     responses:
 *       200:
 *         description: Domain added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Domain added successfully"
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
