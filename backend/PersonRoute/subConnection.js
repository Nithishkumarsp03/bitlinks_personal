const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 

router.post("/subconnections", authenticate, (req, res) => {
  const {
    subemail,
    selectedPersonId,
    connectionInfo,
    imagePath1,
    imagePath2,
    Completion,
    TotalProgress,
  } = req.body;
  console.log(req.body);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // SQL query to insert data into the personalinfo table
    let sql = `
      INSERT INTO personalinfo (useremail, fullname, phonenumber, age, email, dob, rating, visitingcard, linkedinurl, address, shortdescription, hashtags, Completion, overall_completion, sub_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      subemail,
      connectionInfo.fullname,
      connectionInfo.phonenumber,
      connectionInfo.age,
      connectionInfo.email,
      connectionInfo.dob,
      connectionInfo.rating,
      imagePath2,
      connectionInfo.linkedinurl,
      connectionInfo.address,
      connectionInfo.shortdescription,
      connectionInfo.hashtags,
      Completion,
      TotalProgress,
      selectedPersonId,
    ];

    // If imagePath is provided, include it in the SQL query and values
    if (imagePath1) {
      sql = `
        INSERT INTO personalinfo (useremail, profile, fullname, phonenumber, age, email, dob, rating, visitingcard, linkedinurl, address, shortdescription, hashtags, Completion, overall_completion, sub_id)
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
        VALUES (?,?, NOW())
      `;
      insertions.push(
        new Promise((resolve, reject) => {
          connection.query(
            pointsSummary,
            [personId, connectionInfo.rank],
            (err) => {
              if (err) reject(err);
              resolve();
            }
          );
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
