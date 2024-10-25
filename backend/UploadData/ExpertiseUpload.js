const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 

router.put("/expertiseupload", (req, res) => {
  const { selectedPersonId, ExpertiseInfo, Expertise_Completion } = req.body;
  // console.log(req.body);

  // Concatenate skillset array into a comma-separated string
  const skillsetString = ExpertiseInfo.skillset.join(",");
  // console.log('Skillset: ',skillsetString);
  // console.log('Domain: ',ExpertiseInfo.domain);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const sql = `UPDATE expertise
                SET 
                    domain = ?,
                    specialistskills = ?,
                    skillset = ?,
                    Expertise_Completion = ?
                WHERE 
                    person_id = ?;
                `;

    connection.query(
      sql,
      [
        ExpertiseInfo.domain,
        ExpertiseInfo.specialistskills,
        skillsetString, // Use the concatenated string here
        Expertise_Completion,
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
 * /expertiseupload:
 *   put:
 *     summary: Uploads Expertise Data
 *     description: Updates expertise information in the database based on person ID.
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
 *               ExpertiseInfo:
 *                 type: object
 *                 properties:
 *                   domain:
 *                     type: string
 *                     example: "Software Development"
 *                   specialistskills:
 *                     type: string
 *                     example: "JavaScript, React, Node.js"
 *                   skillset:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["JavaScript", "React", "Node.js"]
 *               Expertise_Completion:
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
