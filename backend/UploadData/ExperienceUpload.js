const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 

router.put("/experienceupload", authenticate, (req, res) => {
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
