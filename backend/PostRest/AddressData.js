const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 


router.get("/addressdata", authenticate, (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }
    const sql = "SELECT * FROM address_table";
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
 * /addressdata:
 *   get:
 *     summary: Fetch Address data
 *     description: Retrieves all address entries from the address table.
 *     tags:
 *       - Connection
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Address data fetched successfully
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
 *                   street:
 *                     type: string
 *                     example: "123 Main St"
 *                   city:
 *                     type: string
 *                     example: "Anytown"
 *                   state:
 *                     type: string
 *                     example: "CA"
 *                   zip_code:
 *                     type: string
 *                     example: "12345"
 *                   country:
 *                     type: string
 *                     example: "USA"
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
