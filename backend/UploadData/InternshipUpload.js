const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 

router.put("/internshipupload", authenticate, (req, res) => {
  const {
    selectedPersonId,
    Ifinternship,
    Internshipinfo,
    Internship_Completion,
  } = req.body;

  const skillsetString = Internshipinfo.skillset.join(",");
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
