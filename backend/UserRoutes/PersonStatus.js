const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 
router.post("/personstatus", authenticate, (req, res) => {
  const { person, reason, status } = req.body;
  // console.log(req.body);
  const query = `UPDATE personalinfo
                  SET status = ?, 
                      reason = ?
                  WHERE person_id = ?;`;
  pool.query(query, [status, reason, person], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Failed to update status" });
    }
    res.status(200);
  });
});

module.exports = router; 

/**
 * @swagger
 * /personstatus:
 *   post:
 *     summary: Updates a person's status
 *     description: Updates the status and reason for a person identified by their ID.
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
 *               person:
 *                 type: string
 *                 example: "12345"  
 *               reason:
 *                 type: string
 *                 example: "User requested account deactivation"
 *               status:
 *                 type: string
 *                 example: "inactive"
 *     responses:
 *       200:
 *         description: Person status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Person status updated successfully"
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
