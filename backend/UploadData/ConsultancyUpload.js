const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 

router.put("/consultancyupload", authenticate, (req, res) => {
  const {
    selectedPersonId,
    Ifconsultancy,
    Consultancyinfo,
    Consultancy_Completion,
  } = req.body;
  // console.log("person_id", selectedPersonId);
  // const skillsetString = Consultancyinfo.skillset.join(",");
  const skillsetArray = Array.isArray(Consultancyinfo.skillset) 
  ? Consultancyinfo.skillset 
  : [];
  const skillsetString = skillsetArray.join(",");
  // console.log('Skillset: ',skillsetString);
  // console.log('Domain: ',Consultancyinfo.domain);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const sql = `UPDATE consultancy
        SET ifconsultancy = ?, role = ?, domain = ?, skillset = ?, eligibility = ?, projecttype = ?, Consultancy_Completion = ? 
        WHERE person_id = ?`;

    connection.query(
      sql,
      [
        Ifconsultancy,
        Consultancyinfo.role,
        Consultancyinfo.domain,
        skillsetString,
        Consultancyinfo.eligibility,
        Consultancyinfo.projecttype,
        Consultancy_Completion,
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
 * /consultancyupload:
 *   put:
 *     summary: Uploads Consultancy Data
 *     description: Updates consultancy information in the database based on person ID.
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
 *               Ifconsultancy:
 *                 type: string
 *                 example: "Yes"
 *               Consultancyinfo:
 *                 type: object
 *                 properties:
 *                   role:
 *                     type: string
 *                     example: "Consultant"
 *                   domain:
 *                     type: string
 *                     example: "IT"
 *                   skillset:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["JavaScript", "Node.js"]
 *                   eligibility:
 *                     type: string
 *                     example: "Graduates"
 *                   projecttype:
 *                     type: string
 *                     example: "Full-time"
 *               Consultancy_Completion:
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
