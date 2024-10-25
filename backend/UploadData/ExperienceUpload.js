const express = require("express");
const router = express.Router();
const pool = require("../config.js");  

router.put("/experienceupload", (req, res) => {
  const {
    selectedPersonId,
    Ifexperience,
    PreviousExperienceinfo,
    Experience_Completion,
  } = req.body;
  // console.log("SERVER EXPERIENCE = ",Experience_Completion);
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const sql = `UPDATE previousexperience
        SET ifexperience = ?, companyname = ?, position = ?, experience = ?, role = ?, companyaddress = ?, Experience_Completion = ?
        WHERE person_id = ?`;

    connection.query(
      sql,
      [
        Ifexperience,
        PreviousExperienceinfo.companyname,
        PreviousExperienceinfo.position,
        PreviousExperienceinfo.experience,
        PreviousExperienceinfo.role,
        PreviousExperienceinfo.companyaddress,
        Experience_Completion,
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
 * /experienceupload:
 *   put:
 *     summary: Uploads Experience Data
 *     description: Updates previous experience information in the database based on person ID.
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
 *               Ifexperience:
 *                 type: string
 *                 example: "Yes"
 *               PreviousExperienceinfo:
 *                 type: object
 *                 properties:
 *                   companyname:
 *                     type: string
 *                     example: "Tech Corp"
 *                   position:
 *                     type: string
 *                     example: "Software Engineer"
 *                   experience:
 *                     type: string
 *                     example: "3 years"
 *                   role:
 *                     type: string
 *                     example: "Development"
 *                   companyaddress:
 *                     type: string
 *                     example: "123 Tech Lane, Silicon Valley, CA"
 *               Experience_Completion:
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
