const express = require("express");
const router = express.Router();
const pool = require("../config.js"); 
const authenticate = require("../Authenticate.js"); 


router.post("/companypost", authenticate, (req, res) => {
  const { company } = req.body;
  // console.log(req.body);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }
    const query = "INSERT INTO company_table (company_column) VALUES (?)";
    connection.query(query, [company], (err, results) => {
      connection.release();
      // results.json({ message: 'Status updated successfully.' });
    });
  });
});
module.exports = router; 
