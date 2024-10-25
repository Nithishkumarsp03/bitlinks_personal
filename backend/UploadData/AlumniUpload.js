const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 

/**
 * @swagger
 * /alumniupload:
 *   put:
 *     summary: Uploads Alumni Data
 *     description: Updates alumni information in the database based on person ID.
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
 *               Alumniinfo:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: John Doe
 *                   batch:
 *                     type: string
 *                     example: 2020
 *                   graduatedyear:
 *                     type: string
 *                     example: 2020
 *                   phonenumber:
 *                     type: string
 *                     example: '1234567890'
 *                   companyaddress:
 *                     type: string
 *                     example: "1234 Elm St, Springfield, USA"
 *               Alumni_Completion:
 *                 type: string
 *                 example: Completed
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
 *                   example: Updated successfully!
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

router.put("/alumniupload", authenticate, (req, res) => {
  const { selectedPersonId, Alumniinfo, Alumni_Completion } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const sql = `UPDATE alumni
        SET name = ?, batch = ?, graduatedyear = ?, phonenumber = ?, companyaddress = ? , Alumni_Completion = ?
        WHERE person_id = ?`;

    connection.query(
      sql,
      [
        Alumniinfo.name,
        Alumniinfo.batch,
        Alumniinfo.graduatedyear,
        Alumniinfo.phonenumber,
        Alumniinfo.companyaddress,
        Alumni_Completion,
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
 * /alumniupload:
 *   put:
 *     summary: Uploads Alumni Data
 *     description: Updates alumni information in the database based on person ID.
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
 *               Alumniinfo:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: John Doe
 *                   batch:
 *                     type: string
 *                     example: 2020
 *                   graduatedyear:
 *                     type: string
 *                     example: 2020
 *                   phonenumber:
 *                     type: string
 *                     example: '1234567890'
 *                   companyaddress:
 *                     type: string
 *                     example: "1234 Elm St, Springfield, USA"
 *               Alumni_Completion:
 *                 type: string
 *                 example: Completed
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
