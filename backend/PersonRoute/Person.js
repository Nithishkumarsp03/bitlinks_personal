const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 

router.post( "/person", authenticate, (req, res) => {
  const {
    personInfo,
    imagePath1,
    imagePath2,
    email,
    Completion,
    TotalProgress,
  } = req.body;
  // console.log(req.body);
  if (!personInfo.spoc || personInfo.spoc === "") {
    personInfo.spoc = "no"; 
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // SQL query to insert data into the personalinfo table
    let sql = `
      INSERT INTO personalinfo (useremail, fullname, phonenumber, age, email, dob, rating, visitingcard, linkedinurl, address, shortdescription, hashtags, spoc, Completion, overall_completion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      email,
      personInfo.fullname,
      personInfo.phonenumber,
      personInfo.age,
      personInfo.email,
      personInfo.dob,
      personInfo.rating,
      imagePath2,
      personInfo.linkedinurl,
      personInfo.address,
      personInfo.shortdescription,
      personInfo.hashtags,
      personInfo.spoc,
      Completion,
      TotalProgress,
    ];

    // If imagePath is provided, include it in the SQL query and values
    if (imagePath1) {
      sql = `
        INSERT INTO personalinfo (useremail, profile, fullname, phonenumber, age, email, dob, rating, visitingcard, linkedinurl, address, shortdescription, hashtags, spoc, Completion, overall_completion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      values.splice(1, 0, imagePath1);
    }

    // Insert into personalinfo table
    connection.query(sql, values, function (err, results) {
      if (err) {
        connection.release();
        console.error("Error executing database query:", err);
        return res.status(500).json({ message: "Database error" });
      }

      // Get the last inserted person_id
      const personId = results.insertId;

      // Define insertions into other tables with only person_id
      const insertions = [];

      // Insert into alumni table
      const alumniSql = `
        INSERT INTO alumni (person_id)
        VALUES (?)
        ON DUPLICATE KEY UPDATE Alumni_Completion = VALUES(Alumni_Completion)
      `;
      insertions.push(
        new Promise((resolve, reject) => {
          connection.query(alumniSql, [personId], (err) => {
            if (err) reject(err);
            resolve();
          });
        })
      );

      // Insert into company table
      const companySql = `
        INSERT INTO company (person_id)
        VALUES (?)
        ON DUPLICATE KEY UPDATE Company_Completion = VALUES(Company_Completion)
      `;
      insertions.push(
        new Promise((resolve, reject) => {
          connection.query(companySql, [personId], (err) => {
            if (err) reject(err);
            resolve();
          });
        })
      );

      // Other table insertions follow the same pattern
      const consultancySql = `
        INSERT INTO consultancy (person_id)
        VALUES (?)
        ON DUPLICATE KEY UPDATE Consultancy_Completion = VALUES(Consultancy_Completion)
      `;
      insertions.push(
        new Promise((resolve, reject) => {
          connection.query(consultancySql, [personId], (err) => {
            if (err) reject(err);
            resolve();
          });
        })
      );

      const expertiseSql = `
        INSERT INTO expertise (person_id)
        VALUES (?)
        ON DUPLICATE KEY UPDATE Expertise_Completion = VALUES(Expertise_Completion)
      `;
      insertions.push(
        new Promise((resolve, reject) => {
          connection.query(expertiseSql, [personId], (err) => {
            if (err) reject(err);
            resolve();
          });
        })
      );

      const internshipSql = `
        INSERT INTO internship (person_id)
        VALUES (?)
        ON DUPLICATE KEY UPDATE Internship_Completion = VALUES(Internship_Completion)
      `;
      insertions.push(
        new Promise((resolve, reject) => {
          connection.query(internshipSql, [personId], (err) => {
            if (err) reject(err);
            resolve();
          });
        })
      );

      const outcomeSql = `
        INSERT INTO outcome (person_id)
        VALUES (?)
        ON DUPLICATE KEY UPDATE Outcome_Completion = VALUES(Outcome_Completion)
      `;
      insertions.push(
        new Promise((resolve, reject) => {
          connection.query(outcomeSql, [personId], (err) => {
            if (err) reject(err);
            resolve();
          });
        })
      );

      const placementSql = `
        INSERT INTO placement (person_id)
        VALUES (?)
        ON DUPLICATE KEY UPDATE Placement_Completion = VALUES(Placement_Completion)
      `;
      insertions.push(
        new Promise((resolve, reject) => {
          connection.query(placementSql, [personId], (err) => {
            if (err) reject(err);
            resolve();
          });
        })
      );

      const previousexperienceSql = `
        INSERT INTO previousexperience (person_id)
        VALUES (?)
        ON DUPLICATE KEY UPDATE Experience_Completion = VALUES(Experience_Completion)
      `;
      insertions.push(
        new Promise((resolve, reject) => {
          connection.query(previousexperienceSql, [personId], (err) => {
            if (err) reject(err);
            resolve();
          });
        })
      );

      const pointsSummary = `
        INSERT INTO person_points_summary (person_id, rank, last_updated)
        VALUES (?, ?, NOW())
      `;
      insertions.push(
        new Promise((resolve, reject) => {
          connection.query(pointsSummary, [personId, 0], (err) => {
            if (err) reject(err);
            resolve();
          });
        })
      );

      // Execute all insertions
      Promise.all(insertions)
        .then(() => {
          connection.release();
          res.status(200).json({ message: "Profile saved successfully" });
        })
        .catch((err) => {
          connection.release();
          console.error("Error inserting into related tables:", err);
          res.status(500).json({ message: "Database error" });
        });
    });
  });
});
module.exports = router; 


/**
 * @swagger
 * /person:
 *   post:
 *     summary: Enters user data from new connection form
 *     description: Inserts user data into the personalinfo table and related tables for a new connection.
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
 *               personInfo:
 *                 type: object
 *                 properties:
 *                   spoc:
 *                     type: string
 *                     example: "yes"
 *                   fullname:
 *                     type: string
 *                     example: "John Doe"
 *                   phonenumber:
 *                     type: string
 *                     example: "1234567890"
 *                   age:
 *                     type: integer
 *                     example: 25
 *                   email:
 *                     type: string
 *                     example: "john.doe@example.com"
 *                   dob:
 *                     type: string
 *                     format: date
 *                     example: "1998-01-01"
 *                   rating:
 *                     type: number
 *                     format: float
 *                     example: 4.5
 *                   linkedinurl:
 *                     type: string
 *                     example: "https://www.linkedin.com/in/johndoe"
 *                   address:
 *                     type: string
 *                     example: "123 Main St, Anytown, USA"
 *                   shortdescription:
 *                     type: string
 *                     example: "Software Developer with a passion for coding."
 *                   hashtags:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: ["JavaScript", "Node.js", "React"]
 *               imagePath1:
 *                 type: string
 *                 example: "/path/to/image1.jpg"
 *               imagePath2:
 *                 type: string
 *                 example: "/path/to/image2.jpg"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               Completion:
 *                 type: integer
 *                 example: 80
 *               TotalProgress:
 *                 type: integer
 *                 example: 90
 *     responses:
 *       200:
 *         description: Person info inserted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile saved successfully"
 * 
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
