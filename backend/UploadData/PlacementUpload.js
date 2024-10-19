const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 

router.put("/placementupload", authenticate, (req, res) => {
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
