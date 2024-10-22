const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 
router.get("/userNetworks", authenticate, (req, res) => {
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
    p1.rating,
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
ORDER BY p1.person_id DESC;
                  `;
    // Adjust the SQL query based on your schema
    connection.query(sql, (err, results) => {
      connection.release();

      if (err) {
        console.error("Error executing database query:", err);
        return res.status(500).json({ message: "Database error" });
      }

      res.json(results);
    });
  });
});
module.exports = router; 

/**
 * @swagger
 * /userNetworks:
 *   get:
 *     summary: Fetch user networks data
 *     description: Retrieves user networks data, including personal information, company details, and expertise for all users.
 *     tags:
 *       - Connection
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User networks data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   person_id:
 *                     type: integer
 *                     example: 1
 *                   useremail:
 *                     type: string
 *                     example: "user@example.com"
 *                   profile:
 *                     type: string
 *                     example: "/uploads/profile.jpg"
 *                   fullname:
 *                     type: string
 *                     example: "John Doe"
 *                   phonenumber:
 *                     type: string
 *                     example: "+1234567890"
 *                   age:
 *                     type: integer
 *                     example: 30
 *                   email:
 *                     type: string
 *                     example: "john@example.com"
 *                   linkedinurl:
 *                     type: string
 *                     example: "https://www.linkedin.com/in/johndoe"
 *                   address:
 *                     type: string
 *                     example: "123 Main St, City, Country"
 *                   shortdescription:
 *                     type: string
 *                     example: "Software Developer"
 *                   hashtags:
 *                     type: string
 *                     example: "#developer #software"
 *                   Completion:
 *                     type: integer
 *                     example: 80
 *                   overall_completion:
 *                     type: integer
 *                     example: 90
 *                   reason:
 *                     type: string
 *                     example: "Active"
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-01-01T00:00:00Z"
 *                   sub_id:
 *                     type: integer
 *                     example: 2
 *                   status:
 *                     type: string
 *                     example: "Connected"
 *                   sub_name:
 *                     type: string
 *                     example: "Jane Doe"
 *                   company_id:
 *                     type: integer
 *                     example: 1
 *                   companyname:
 *                     type: string
 *                     example: "Tech Solutions Inc."
 *                   position:
 *                     type: string
 *                     example: "Senior Developer"
 *                   experience:
 *                     type: integer
 *                     example: 5
 *                   role:
 *                     type: string
 *                     example: "Full Stack Developer"
 *                   companyaddress:
 *                     type: string
 *                     example: "456 Company St, City, Country"
 *                   Company_Completion:
 *                     type: integer
 *                     example: 75
 *                   domain:
 *                     type: string
 *                     example: "Software Development"
 *                   specialistskills:
 *                     type: string
 *                     example: "Java, React"
 *                   skillset:
 *                     type: string
 *                     example: "JavaScript, HTML, CSS"
 *                   summary_id:
 *                     type: integer
 *                     example: 1
 *                   total_points:
 *                     type: integer
 *                     example: 100
 *                   rank:
 *                     type: integer
 *                     example: 1
 *                   last_updated:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-01-01T00:00:00Z"
 *                   reduction:
 *                     type: integer
 *                     example: 0
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
