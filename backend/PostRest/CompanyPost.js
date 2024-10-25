const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 


router.post("/companypost", authenticate, (req, res) => {
  const { company } = req.body;
  // console.log(req.body);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }
    const query = "INSERT INTO company_table (company_column) VALUES (?)";
    connection.query(query, [company], (err, results) => {
      connection.release();
      // results.json({ message: 'Status updated successfully.' });
    });
  });
});
module.exports = router; 

/**
 * @swagger
 * /companypost:
 *   post:
 *     summary: Add Company data
 *     description: Inserts a new company entry into the company table.
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
 *               company:
 *                 type: string
 *                 example: "Tech Solutions"
 *     responses:
 *       200:
 *         description: Company added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Company added successfully"
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
