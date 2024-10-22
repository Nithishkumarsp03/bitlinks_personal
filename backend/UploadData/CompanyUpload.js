const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 

router.put("/companyupload", authenticate, (req, res) => {
  const { selectedPersonId, CompanyInfo, Company_Completion } = req.body;
  console.log(req.body);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const sql = `UPDATE company 
        SET companyname = ?, position = ?, experience = ?, role = ?, companyaddress = ?, websiteurl = ?, scale = ?, payscale = ?, Company_Completion = ? 
        WHERE person_id = ?`;

    connection.query(
      sql,
      [
        CompanyInfo.companyname,
        CompanyInfo.position,
        CompanyInfo.experience,
        CompanyInfo.role,
        CompanyInfo.companyaddress,
        CompanyInfo.websiteurl,
        CompanyInfo.scale,
        CompanyInfo.payscale,
        Company_Completion,
        selectedPersonId,
      ],
      (err, results) => {
        connection.release();

        if (err) {
          console.error("Error updating person data:", err);
          return res
            .status(500)
            .json({ error: "An error occurred while updating the data." });
        }

        res.status(200).json({ message: "Updated successfully!" });
      }
    );
  });
});

module.exports = router; 


/**
 * @swagger
 * /companyupload:
 *   put:
 *     summary: Uploads Company Data
 *     description: Updates company information in the database based on person ID.
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
 *               selectedPersonId:
 *                 type: integer
 *                 example: 1
 *               CompanyInfo:
 *                 type: object
 *                 properties:
 *                   companyname:
 *                     type: string
 *                     example: "Tech Innovations"
 *                   position:
 *                     type: string
 *                     example: "Software Engineer"
 *                   experience:
 *                     type: string
 *                     example: "2 years"
 *                   role:
 *                     type: string
 *                     example: "Full Stack Developer"
 *                   companyaddress:
 *                     type: string
 *                     example: "123 Tech St, Silicon Valley, CA"
 *                   websiteurl:
 *                     type: string
 *                     example: "https://www.techinnovations.com"
 *                   scale:
 *                     type: string
 *                     example: "Mid-size"
 *                   payscale:
 *                     type: string
 *                     example: "$80,000 - $100,000"
 *               Company_Completion:
 *                 type: string
 *                 example: "Completed"
 *     responses:
 *       200:
 *         description: Uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Updated successfully!"
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
