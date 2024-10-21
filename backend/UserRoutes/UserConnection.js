const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 
router.post("/userConnections", authenticate, (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const sql = `SELECT 
    p1.person_id, 
    p1.useremail, 
    p1.profile, 
    p1.fullname, 
    p1.phonenumber, 
    p1.age, 
    p1.email, 
    p1.linkedinurl, 
    p1.address, 
    p1.shortdescription, 
    p1.hashtags, 
    p1.Completion, 
    p1.overall_completion, 
    p1.reason, 
    p1.timestamp, 
    p1.sub_id, 
    p1.status,
    COALESCE(p2.fullname, p1.fullname) AS sub_name,  -- Use the main name if sub_name is NULL
    company.company_id, 
    company.companyname, 
    company.position, 
    company.experience, 
    company.role, 
    company.companyaddress, 
    company.Company_Completion, 
    expertise.domain,
    expertise.specialistskills,
    expertise.skillset,
    pps.summary_id, 
    pps.total_points, 
    pps.rank, 
    pps.last_updated, 
    pps.reduction
FROM personalinfo p1
INNER JOIN company ON p1.person_id = company.person_id
LEFT JOIN expertise ON p1.person_id = expertise.person_id
LEFT JOIN personalinfo p2 ON p2.person_id = p1.sub_id
LEFT JOIN person_points_summary pps ON pps.person_id = p1.person_id
WHERE p1.useremail = ?
ORDER BY p1.person_id DESC;
`;

    connection.query(sql, [email], (err, results) => {
      connection.release();

      if (err) {
        console.error("Error executing database query:", err);
        return res.status(500).json({ message: "Database error" });
      }

      // if (results.length === 0) {
      //   return res
      //     .status(404)
      //     .json({ message: "No data found for the given email" });
      // }

      res.json(results); // Return all results as an array
    });
  });
});
module.exports = router; 
