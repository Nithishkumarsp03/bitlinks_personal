const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
router.put("/internshipupload", (req, res) => {
  const {
    selectedPersonId,
    Ifinternship,
    Internshipinfo,
    Internship_Completion,
  } = req.body;

  // const skillsetString = Internshipinfo.skillset.join(",");

  const skillsetArray = Array.isArray(Internshipinfo.skillset) 
  ? Internshipinfo.skillset 
  : [];
  const skillsetString = skillsetArray.join(",");
  // console.log('Skillset: ',skillsetString);
  // console.log('Domain: ',Internshipinfo.domain);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const sql = `UPDATE internship
        SET ifinternship = ?, role = ?, domain = ?, skillset = ?, eligibility = ?, projecttype = ? , Internship_Completion = ?
        WHERE person_id = ?`;

    connection.query(
      sql,
      [
        Ifinternship,
        Internshipinfo.role,
        Internshipinfo.domain,
        skillsetString,
        Internshipinfo.eligibility,
        Internshipinfo.projecttype,
        Internship_Completion,
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
 * /internshipupload:
 *   put:
 *     summary: Uploads Internship Data
 *     description: Updates internship information in the database based on person ID.
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
 *               Ifinternship:
 *                 type: boolean
 *                 example: true
 *               Internshipinfo:
 *                 type: object
 *                 properties:
 *                   role:
 *                     type: string
 *                     example: "Software Intern"
 *                   domain:
 *                     type: string
 *                     example: "Information Technology"
 *                   skillset:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Java", "C++", "Python"]
 *                   eligibility:
 *                     type: string
 *                     example: "Undergraduate"
 *                   projecttype:
 *                     type: string
 *                     example: "Web Development"
 *               Internship_Completion:
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
