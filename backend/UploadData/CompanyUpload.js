const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 

router.put("/companyupload", authenticate, (req, res) => {
  const { selectedPersonId, CompanyInfo, Company_Completion } = req.body;
  console.log(req.body);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const sql = `UPDATE company 
        SET companyname = ?, position = ?, experience = ?, role = ?, companyaddress = ?, websiteurl = ?, scale = ?, payscale = ?, Company_Completion = ? 
        WHERE person_id = ?`;

    connection.query(
      sql,
      [
        CompanyInfo.companyname,
        CompanyInfo.position,
        CompanyInfo.experience,
        CompanyInfo.role,
        CompanyInfo.companyaddress,
        CompanyInfo.websiteurl,
        CompanyInfo.scale,
        CompanyInfo.payscale,
        Company_Completion,
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
