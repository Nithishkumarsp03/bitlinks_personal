const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 

router.put("/placementupload", (req, res) => {
  const { selectedPersonId, Ifplacement, Placementinfo, Placement_Completion } =
    req.body;

  const skillsetString = (Placementinfo.skillset || []).join(",");
  // console.log('Skillset: ',skillsetString);
  // console.log('Domain: ',Placementinfo.domain);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const sql = `UPDATE placement
        SET ifplacement = ?, role = ?, domain = ?, skillset = ?, eligibility = ? , Placement_Completion = ?
        WHERE person_id = ?`;

    connection.query(
      sql,
      [
        Ifplacement,
        Placementinfo.role,
        Placementinfo.domain,
        skillsetString,
        Placementinfo.eligibility,
        Placement_Completion,
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
 * /placementupload:
 *   put:
 *     summary: Uploads Placement Data
 *     description: Updates placement information in the database based on person ID.
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
 *               Ifplacement:
 *                 type: boolean
 *                 example: true
 *               Placementinfo:
 *                 type: object
 *                 properties:
 *                   role:
 *                     type: string
 *                     example: "Software Engineer"
 *                   domain:
 *                     type: string
 *                     example: "Information Technology"
 *                   skillset:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Java", "JavaScript", "Node.js"]
 *                   eligibility:
 *                     type: string
 *                     example: "Eligible for placement"
 *               Placement_Completion:
 *                 type: string
 *                 example: "Completed"
 *     responses:
 *       200:
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Updated successfully!"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid input data."
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
