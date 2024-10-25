const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 

router.get("/companydata", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }
    const sql = "SELECT * FROM company_table";
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
 * /companydata:
 *   get:
 *     summary: Fetch Company data
 *     description: Retrieves all company entries from the company table.
 *     tags:
 *       - Connection
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Company data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   company_id:
 *                     type: integer
 *                     example: 1
 *                   company_name:
 *                     type: string
 *                     example: "Tech Solutions"
 *                   location:
 *                     type: string
 *                     example: "123 Tech Lane, Silicon Valley, CA"
 *                   contact_number:
 *                     type: string
 *                     example: "+1-234-567-8901"
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
