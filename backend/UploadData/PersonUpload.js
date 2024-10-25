const express = require("express");
const router = express.Router();
const pool = require("../config.js");  

router.put("/personupload", (req, res) => {
  const {
    selectedPersonId,
    personInfo,
    imagePath1,
    imagePath2,
    Completion,
    TotalProgress,
  } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    let sql = `UPDATE personalinfo
               SET fullname = ?, phonenumber = ?, age = ?, email = ?, dob = ?, rating = ?, visitingcard = ?, linkedinurl = ?, address = ?, shortdescription = ?, hashtags = ?, Completion = ?, overall_completion = ? `;

    let queryParams = [
      personInfo.fullname,
      personInfo.phonenumber,
      personInfo.age,
      personInfo.email,
      // personInfo.dob,
      personInfo.dob ? new Date(personInfo.dob).toISOString().split('T')[0] : null,
      personInfo.rating,
      imagePath2,
      personInfo.linkedinurl,
      personInfo.address,
      personInfo.shortdescription,
      personInfo.hashtags,
      Completion,
      TotalProgress,
    ];

    // Add profile column update only if imagePreview is not null or empty
    if (imagePath1) {
      sql += `, profile = ?`;
      queryParams.push(imagePath1);
    }

    sql += ` WHERE person_id = ?`;
    queryParams.push(selectedPersonId);

    // First query: Update personalinfo table
    connection.query(sql, queryParams, (err, results) => {
      if (err) {
        connection.release();
        console.error("Error updating person data:", err);
        return res.status(500).json({ error: "An error occurred while updating the data." });
      }

      // Second query: Update person_points_summary table with rank
      // let rankSql = `UPDATE person_points_summary SET rank = ? WHERE person_id = ?`;
      let rankSql = `UPDATE person_points_summary SET \`rank\` = ? WHERE person_id = ?`;
      let rankParams = [personInfo.rank, selectedPersonId];

      connection.query(rankSql, rankParams, (err, rankResults) => {
        connection.release(); // Release the connection after both queries are done

        if (err) {
          console.error("Error updating rank data:", err);
          return res.status(500).json({ error: "An error occurred while updating the rank." });
        }

        res.status(200).json({ message: "Updated successfully!" });
      });
    });
  });
});


module.exports = router; 

/**
 * @swagger
 * /personupload:
 *   put:
 *     summary: Uploads Person Info Data
 *     description: Updates personal information in the database based on person ID.
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
 *               personInfo:
 *                 type: object
 *                 properties:
 *                   fullname:
 *                     type: string
 *                     example: "John Doe"
 *                   phonenumber:
 *                     type: string
 *                     example: "1234567890"
 *                   age:
 *                     type: integer
 *                     example: 30
 *                   email:
 *                     type: string
 *                     example: "john.doe@example.com"
 *                   dob:
 *                     type: string
 *                     format: date
 *                     example: "1993-01-01"
 *                   rating:
 *                     type: number
 *                     format: float
 *                     example: 4.5
 *                   linkedinurl:
 *                     type: string
 *                     example: "https://www.linkedin.com/in/johndoe"
 *                   address:
 *                     type: string
 *                     example: "123 Elm St, Springfield, USA"
 *                   shortdescription:
 *                     type: string
 *                     example: "Passionate software engineer."
 *                   hashtags:
 *                     type: string
 *                     example: "#software #developer"
 *                   rank:
 *                     type: integer
 *                     example: 1
 *               imagePath1:
 *                 type: string
 *                 example: "path/to/image1.jpg"
 *               imagePath2:
 *                 type: string
 *                 example: "path/to/image2.jpg"
 *               Completion:
 *                 type: string
 *                 example: "Completed"
 *               TotalProgress:
 *                 type: string
 *                 example: "75%"
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
