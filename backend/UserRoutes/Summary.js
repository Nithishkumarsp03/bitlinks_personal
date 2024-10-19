const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 


router.post("/summary", authenticate, (req, res) => {
  const { selectedPersonId } = req.body;
  // console.log("This is id:", person_id);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const sql = `SELECT 
    p.fullname, 
    p.phonenumber, 
    p.age, 
    p.email, 
    p.linkedinurl, 
    p.address, 
    p.hashtags,
    c.companyname, 
    c.position, 
    c.experience, 
    c.role, 
    c.companyaddress,
    e.domain, 
    e.specialistskills, 
    e.skillset,
    TRIM(LEADING ',' FROM GROUP_CONCAT(DISTINCT h.purpose)) AS purposes -- Remove leading comma
FROM 
    personalinfo p
INNER JOIN 
    company c ON p.person_id = c.person_id
INNER JOIN 
    expertise e ON p.person_id = e.person_id
LEFT JOIN
    history h ON p.person_id = h.person_id
WHERE 
    p.person_id = ?
GROUP BY 
    p.fullname, p.phonenumber, p.age, p.email, p.linkedinurl, p.address, p.hashtags,
    c.companyname, c.position, c.experience, c.role, c.companyaddress,
    e.domain, e.specialistskills, e.skillset;
`;
    // Query to fetch person data based on ID
    connection.query(sql, [selectedPersonId], (error, results) => {
      connection.release(); // Always release the connection after the query

      if (error) {
        console.error("Error fetching person data:", error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching the data." });
        return;
      }

      // If no data is found
      if (results.length === 0) {
        res.status(404).json({ message: "Person not found." });
        return;
      }

      res.json(results[0]);
    });
  });
});

module.exports = router; 
