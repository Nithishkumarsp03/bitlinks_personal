const express = require("express");
const bodyParser = require("body-parser");
const mysql = require('mysql2');
const multer = require("multer");
const fs = require("fs"); // Make sure this line is included
const path = require("path");
const app = express();
const cron = require('node-cron');
const cors = require("cors");
const pool = require("./config.js")
require('dotenv').config(); // Load environment variables
const auth = require('./auth.js')
const passport = require("passport");
// const moment = require('moment');
const session = require("express-session");
const passportConfig = require("./passport.js")
const nodemailer = require('nodemailer');
const PORT = process.env.PORT;
const api = process.env.API;
const SECRET_KEY = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const authenticate = require('./Authenticate.js')

// Middleware function example
const myMiddleware = (req, res, next) => {
  next(); // Pass control to the next middleware function
};

// Use middleware globally for all routes
app.use(myMiddleware);
// app.use(authenticate);

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(
  session({
    secret: "this is my secrect code",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(api , auth)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination folder for uploaded files
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Set the filename for the uploaded file
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASSWORD,
  },
});

const upload = multer({ storage });

// Create the uploads directory if it doesn't exist
const uploadsDir = "uploads/";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve static files from the uploads directory
app.use(api + "/uploads", express.static(path.join(__dirname, "uploads")));

// Email sending endpoint
app.post('/send-email', authenticate, (req, res) => {
  const { toEmail, subject, message } = req.body;

  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'

  // Log for debugging
  console.log("Authorization Header:", authHeader);
  console.log("Token:", token);

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  // Verify the token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err.message);
      return res.status(403).json({ message: "Invalid token" });
    }

    // Proceed with email sending if token is valid
    const mailOptions = {
      from: `"BITLINKS" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: subject,
      text: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send('Error sending email');
      }
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully');
    });
  });
});

app.post(api + "/google", (req, res) => {
  const { email } = req.body;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    connection.query(
      "SELECT ROLE FROM login WHERE EMAIL = ? AND STATUS = 1",
      [email],
      (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing database query:", err);
          return res.status(500).json({ message: "Database error" });
        }

        if (results.length > 0) {
          const role = results[0].ROLE; // Extract the role from the result
          res.status(200).json({ message: "Login successful", role: role });
        } else {
          res.status(401).json({ message: "Invalid username or password" });
        }
      }
    );
  });
});


app.post(api + "/check-connection", authenticate, (req, res) => {
  console.log("check connection");
  const { name } = req.body;
  const normalizedName = name.trim().toLowerCase(); // Normalize the input name

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    connection.query(
      "SELECT * FROM personalinfo WHERE LOWER(fullname) = ?",
      [normalizedName],
      (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing database query:", err);
          return res.status(500).json({ message: "Database error" });
        }

        if (results.length > 0) {
          res.status(200).json({ message: "found" });
        } else {
          res.status(401).json({ message: "notfound" });
        }
      }
    );
  });
});

app.post(api + "/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });x
  }
  res.json({ path: `/uploads/${req.file.filename}` });
});

app.post(api + '/upload/history', upload.array('files', 2), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  const paths = req.files.map(file => `/uploads/${file.filename}`);
  res.json({ paths });
});

app.post(api + "/person", authenticate, (req, res) => {
  const { personInfo, imagePath, email, Completion, TotalProgress } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // SQL query to insert data into the personalinfo table
    let sql = `
      INSERT INTO personalinfo (useremail, fullname, phonenumber, age, email, linkedinurl, address, shortdescription, hashtags, Completion, overall_completion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      email,
      personInfo.fullname,
      personInfo.phonenumber,
      personInfo.age,
      personInfo.email,
      personInfo.linkedinurl,
      personInfo.address,
      personInfo.shortdescription,
      personInfo.hashtags,
      Completion,
      TotalProgress,
    ];

    // If imagePath is provided, include it in the SQL query and values
    if (imagePath) {
      sql = `
        INSERT INTO personalinfo (useremail, profile, fullname, phonenumber, age, email, linkedinurl, address, shortdescription, hashtags, Completion, overall_completion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      values.splice(1, 0, imagePath);
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
        INSERT INTO person_points_summary (person_id, last_updated)
        VALUES (?, NOW())
      `;
      insertions.push(
        new Promise((resolve, reject) => {
          connection.query(pointsSummary, [personId], (err) => {
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
//////////////////////// Sub-Connections///////////////////////////////
app.post(api + "/subconnections", authenticate, (req, res) => {
  const { email, selectedPersonId, connectionInfo, imagePath, Completion, TotalProgress } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // SQL query to insert data into the personalinfo table
    let sql = `
      INSERT INTO personalinfo (useremail, fullname, phonenumber, age, email, linkedinurl, address, shortdescription, hashtags, Completion, overall_completion, sub_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      email,
      connectionInfo.fullname,
      connectionInfo.phonenumber,
      connectionInfo.age,
      connectionInfo.email,
      connectionInfo.linkedinurl,
      connectionInfo.address,
      connectionInfo.shortdescription,
      connectionInfo.hashtags,
      Completion,
      TotalProgress,
      selectedPersonId,
    ];

    // If imagePath is provided, include it in the SQL query and values
    if (imagePath) {
      sql = `
        INSERT INTO personalinfo (useremail, profile, fullname, phonenumber, age, email, linkedinurl, address, shortdescription, hashtags, Completion, overall_completion, sub_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      values.splice(1, 0, imagePath);
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
        INSERT INTO person_points_summary (person_id, last_updated)
        VALUES (?, NOW())
      `;
      insertions.push(
        new Promise((resolve, reject) => {
          connection.query(pointsSummary, [personId], (err) => {
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

app.get(api + "/personalinfo/main/:personId", authenticate,(req, res) => {
  const { personId } = req.params;

  const query = "SELECT * FROM personalinfo WHERE person_id = ?";

  pool.query(query, [personId], (error, results) => {
    if (error) {
      console.error("Error fetching main connection:", error);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results[0]); // Return the first (and only) result
  });
});

// API to fetch sub-connections (entries where sub_id = selectedPersonId)
app.get(api + "/personalinfo/subconnections/:personId", authenticate, (req, res) => {
  const { personId } = req.params;

  const query = `SELECT personalinfo.*, person_points_summary.*
                FROM personalinfo
                LEFT JOIN person_points_summary 
                ON personalinfo.person_id = person_points_summary.person_id
                WHERE personalinfo.sub_id = ?`;

  pool.query(query, [personId], (error, results) => {
    if (error) {
      console.error("Error fetching sub-connections:", error);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results); // Return all matching results
  });
});


app.get(api + "/userNetworks", authenticate, (req, res) => {
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

app.post(api + "/userConnections", authenticate, (req, res) => {
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

app.post(api + '/personstatus', authenticate, (req, res) => {
  const {person, reason, status} = req.body;
  // console.log(req.body);
  const query = `UPDATE personalinfo
                  SET status = ?, 
                      reason = ?
                  WHERE person_id = ?;`
  pool.query(query,[status, reason, person], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Failed to update status' });
    }
    res.status(200)
  });
});

app.post(api + '/userranks', (req, res) => {
  const { email } = req.body; // Assuming email is passed as a query parameter

  const query = `
    SELECT
      COUNT(CASE WHEN pps.rank = 3 THEN 1 END) AS count_rank_3,
      COUNT(CASE WHEN pps.rank = 2 THEN 1 END) AS count_rank_2,
      COUNT(CASE WHEN pps.rank = 1 THEN 1 END) AS count_rank_1,
      COUNT(CASE WHEN pps.rank = 0 THEN 1 END) AS count_rank_0
    FROM person_points_summary pps
    LEFT JOIN personalinfo p ON pps.person_id = p.person_id
    WHERE p.useremail = ?;
  `;

  pool.query(query, [email], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Failed to fetch user ranks counts.' });
    }

    // Extract counts from results
    const counts = results[0] || {};
    
    res.status(200).json(counts);
  });
});

app.post(api + '/networkranks', authenticate, (req, res) => {

  const query = `
    SELECT
      COUNT(CASE WHEN pps.rank = 3 THEN 1 END) AS count_rank_3,
      COUNT(CASE WHEN pps.rank = 2 THEN 1 END) AS count_rank_2,
      COUNT(CASE WHEN pps.rank = 1 THEN 1 END) AS count_rank_1,
      COUNT(CASE WHEN pps.rank = 0 THEN 1 END) AS count_rank_0
    FROM person_points_summary pps
    JOIN personalinfo p ON pps.person_id = p.person_id
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Failed to fetch user ranks counts.' });
    }

    // Extract counts from results
    const counts = results[0] || {};
    
    res.status(200).json(counts);
  });
});


app.post(api + "/summary", authenticate, (req, res) => {
  const {selectedPersonId} = req.body;
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
`
    // Query to fetch person data based on ID
    connection.query(
      sql,
      [selectedPersonId],
      (error, results) => {
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
      }
    );
  });
});



app.get(api + "/persondata/:id", authenticate, (req, res) => {
  const person_id = req.params.id;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    connection.query(
      "SELECT * FROM personalinfo WHERE person_id = ?",
      [person_id],
      (error, results) => {
        connection.release(); // Always release the connection after the query

        if (error) {
          console.error("Error fetching person data:", error);
          res
            .status(500)
            .json({ error: "An error occurred while fetching the data." });
          return;
        }

        // If no data is found
        // if (results.length === 0) {
        //   res.status(404).json({ message: "Person not found." });
        //   return;
        // }

        res.json(results[0]);
      }
    );
  });
});

app.post(api + "/experiencedata", authenticate, (req, res) => {
  const { person_id } = req.body;
  // console.log("Fetching experience data for ID:", person_id);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Query to fetch experience data based on ID
    connection.query(
      "SELECT * FROM previousexperience WHERE person_id = ?",
      [person_id],
      (error, results) => {
        connection.release(); // Always release the connection after the query

        if (error) {
          console.error("Error fetching experience data:", error);
          return res
            .status(500)
            .json({ error: "An error occurred while fetching the data." });
        }

        // If no data is found
        if (results.length === 0) {
          return res
            .status(404)
            .json({ message: "Experience data not found." });
        }

        res.json(results[0]);
      }
    );
  });
});

app.post(api + "/companydata", authenticate, (req, res) => {
  const { person_id } = req.body;
  // console.log("This is id:", person_id);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Query to fetch person data based on ID
    connection.query(
      "SELECT * FROM company WHERE person_id = ?",
      [person_id],
      (error, results) => {
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
      }
    );
  });
});

app.get(api + "/expertisedata/:id", authenticate, (req, res) => {
  const person_id = req.params.id;
  // console.log("This is id:", person_id);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Query to fetch person data based on ID
    connection.query(
      "SELECT * FROM expertise WHERE person_id = ?",
      [person_id],
      (error, results) => {
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
      }
    );
  });
});

app.get(api + "/expertisedata/domains", authenticate, (req, res) => {

  pool.getConnection((err,connection) => {
    if(err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const query = `
    SELECT
      SUM(CASE WHEN domain = 'Hardware' THEN 1 ELSE 0 END) AS hardwareCount,
      SUM(CASE WHEN domain = 'Software' THEN 1 ELSE 0 END) AS softwareCount,
      SUM(CASE WHEN domain = 'Others' THEN 1 ELSE 0 END) AS othersCount
    FROM expertise
  `;

  connection.query(query, [person_id], (error, results) => {
    connection.release(); // Always release the connection after the query

    if (error) {
      console.error("Error fetching expertise data:", error);
      return res.status(500).json({ error: "An error occurred while fetching the data." });
    }

    // If no data is found
    if (results.length === 0) {
      return res.status(404).json({ message: "Person not found." });
    }

    // Send the counts as a JSON response
    res.json({
      hardwareCount: results[0].hardwareCount || 0,
      softwareCount: results[0].softwareCount || 0,
      othersCount: results[0].othersCount || 0,
    });
  });
  })
})

app.get(api + "/placementdata/:id", authenticate, (req, res) => {
  const person_id = req.params.id;
  // console.log("This is id:", person_id);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Query to fetch person data based on ID
    connection.query(
      "SELECT * FROM placement WHERE person_id = ?",
      [person_id],
      (error, results) => {
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
      }
    );
  });
});

app.post(api + "/consultancydata", authenticate, (req, res) => {
  const { person_id } = req.body;
  // console.log("This is id:", person_id);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Query to fetch person data based on ID
    connection.query(
      "SELECT * FROM consultancy WHERE person_id = ?",
      [person_id],
      (error, results) => {
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
      }
    );
  });
});

app.post(api + "/internshipdata", authenticate, (req, res) => {
  const { person_id } = req.body;
  // console.log("This is internship:", person_id);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Query to fetch person data based on ID
    connection.query(
      "SELECT * FROM internship WHERE person_id = ?",
      [person_id],
      (error, results) => {
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
      }
    );
  });
});

app.post(api + "/alumnidata", authenticate, (req, res) => {
  const { person_id } = req.body;
  // console.log("This is internship:", person_id);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Query to fetch person data based on ID
    connection.query(
      "SELECT * FROM alumni WHERE person_id = ?",
      [person_id],
      (error, results) => {
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
      }
    );
  });
});

app.post(api + "/outcomedata", authenticate, (req, res) => {
  const { person_id } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Query to fetch person data based on ID
    connection.query(
      "SELECT * FROM outcome WHERE person_id = ?",
      [person_id],
      (error, results) => {
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
      }
    );
  });
});

app.put(api + "/personupload", authenticate, (req, res) => {
  const {
    selectedPersonId,
    personInfo,
    imagePreview,
    Completion,
    TotalProgress,
  } = req.body;
  // console.log("BACKEND TOTAL VALUE = ", TotalProgress);
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    let sql = `UPDATE personalinfo
               SET fullname = ?, phonenumber = ?, age = ?, email = ?, linkedinurl = ?, address = ?, shortdescription = ?, hashtags = ? ,Completion = ?, overall_completion = ? `;

    let queryParams = [
      personInfo.fullname,
      personInfo.phonenumber,
      personInfo.age,
      personInfo.email,
      personInfo.linkedinurl,
      personInfo.address,
      personInfo.shortdescription,
      personInfo.hashtags,
      Completion,
      TotalProgress,
    ];

    // Add profile column update only if imagePreview is not null or empty
    if (imagePreview) {
      sql += `, profile = ?`;
      queryParams.push(imagePreview);
    }

    sql += ` WHERE person_id = ?`;
    queryParams.push(selectedPersonId);

    connection.query(sql, queryParams, (err, results) => {
      connection.release();

      if (err) {
        console.error("Error updating person data:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while updating the data." });
      }

      res.status(200).json({ message: "Updated successfully!" });
    });
  });
});

app.put(api + "/companyupload", authenticate, (req, res) => {
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

app.put(api + "/alumniupload", authenticate, (req, res) => {
  const { selectedPersonId, Alumniinfo, Alumni_Completion } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const sql = `UPDATE alumni
        SET name = ?, batch = ?, graduatedyear = ?, phonenumber = ?, companyaddress = ? , Alumni_Completion = ?
        WHERE person_id = ?`;

    connection.query(
      sql,
      [
        Alumniinfo.name,
        Alumniinfo.batch,
        Alumniinfo.graduatedyear,
        Alumniinfo.phonenumber,
        Alumniinfo.companyaddress,
        Alumni_Completion,
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

app.put(api + "/outcomeupload", authenticate, (req, res) => {
  const { selectedPersonId, Outcomeinfo, Outcome_Completion } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const sql = `UPDATE outcome
        SET eventname = ?, date = ?, description = ?, Outcome_Completion = ?
        WHERE person_id = ?`;

    connection.query(
      sql,
      [
        Outcomeinfo.eventname,
        Outcomeinfo.date,
        Outcomeinfo.description,
        Outcome_Completion,
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

app.put(api + "/experienceupload", authenticate, (req, res) => {
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

app.put(api + "/placementupload", authenticate, (req, res) => {
  const { selectedPersonId, Ifplacement, Placementinfo, Placement_Completion } =
    req.body;

    const skillsetString = (Placementinfo.skillset || []).join(',');
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

app.put(api + "/consultancyupload", authenticate, (req, res) => {
  const {
    selectedPersonId,
    Ifconsultancy,
    Consultancyinfo,
    Consultancy_Completion,
  } = req.body;
  // console.log("person_id", selectedPersonId);
  const skillsetString = Consultancyinfo.skillset.join(',');
  // console.log('Skillset: ',skillsetString);
  // console.log('Domain: ',Consultancyinfo.domain);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const sql = `UPDATE consultancy
        SET ifconsultancy = ?, role = ?, domain = ?, skillset = ?, eligibility = ?, projecttype = ?, Consultancy_Completion = ? 
        WHERE person_id = ?`;

    connection.query(
      sql,
      [
        Ifconsultancy,
        Consultancyinfo.role,
        Consultancyinfo.domain,
        skillsetString,
        Consultancyinfo.eligibility,
        Consultancyinfo.projecttype,
        Consultancy_Completion,
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

app.put(api + "/internshipupload", authenticate, (req, res) => {
  const {
    selectedPersonId,
    Ifinternship,
    Internshipinfo,
    Internship_Completion,
  } = req.body;

  const skillsetString = Internshipinfo.skillset.join(',');
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

app.put(api + "/expertiseupload", authenticate, (req, res) => {
  const { selectedPersonId, ExpertiseInfo, Expertise_Completion } = req.body;
  // console.log(req.body);

  // Concatenate skillset array into a comma-separated string
  const skillsetString = ExpertiseInfo.skillset.join(',');
  // console.log('Skillset: ',skillsetString);
  // console.log('Domain: ',ExpertiseInfo.domain);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const sql = `UPDATE expertise
                SET 
                    domain = ?,
                    specialistskills = ?,
                    skillset = ?,
                    Expertise_Completion = ?
                WHERE 
                    person_id = ?;
                `;

    connection.query(
      sql,
      [
        ExpertiseInfo.domain,
        ExpertiseInfo.specialistskills,
        skillsetString,  // Use the concatenated string here
        Expertise_Completion,
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


const moment = require('moment-timezone');

// Example timezone you want to use, e.g., 'Asia/Kolkata'
const timezone = 'Asia/Kolkata'; 

app.post(api + '/addhistory', authenticate, (req, res) => {
  const {
    selectedPersonId,
    username,
    email,
    type,
    note,
    purpose,
    points,
    scheduled_date,
    imagePath1,
    imagePath2,
    status
  } = req.body;

  console.log('Original data received:', req.body);

  // Format the provided scheduled_date to MySQL datetime format with the correct timezone
  const formattedDate = scheduled_date
    ? moment.tz(scheduled_date, timezone).format('YYYY-MM-DD HH:mm:ss')
    : null;

  console.log("Formatted date: ", formattedDate);

  // Prepare the SQL query
  const query = `
    INSERT INTO history (person_id, agent, email, type, note, purpose, scheduleddate, visited1, visited2, points, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Execute the SQL query
  pool.query(query, [selectedPersonId, username, email, type, note, purpose, formattedDate, imagePath1, imagePath2, points, status], (err, result) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ message: 'Failed to insert record.' });
    }

    res.status(200).json({ message: 'Record inserted successfully', newRecord: result.insertId });
  });
});


app.get(api + '/fetch-scheduled', authenticate, (req, res) => {
  const query = `SELECT h.*, p.*
                FROM history h
                JOIN personalinfo p ON h.person_id = p.person_id
                WHERE h.status = 1;
                `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching scheduled data:', err);
      return res.status(500).send('Server error');
    }
    res.json(results);
  });
});

// Route to fetch all schedule data
app.post(api + '/schedule', authenticate, (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const query = `
    SELECT h.*, p.fullname, p.profile
    FROM history h
    JOIN personalinfo p ON h.person_id = p.person_id
    WHERE h.status = 1
    AND p.useremail = ?
  `;

  pool.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error fetching schedule data:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});


app.post(api + '/history-status', authenticate, (req, res) => {
  const { history_id, status } = req.body;

  if (!history_id || typeof status === 'undefined') {
    return res.status(400).json({ error: 'Missing required fields: history_id and status' });
  }

  const query = 'UPDATE history SET status = ? WHERE history_id = ?';
  
  pool.query(query, [status, history_id], (err, result) => {
    if (err) {
      console.error('Error updating history status:', err);
      return res.status(500).json({ error: 'Failed to update history status' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No history record found with the given ID' });
    }

    res.status(200).json({ message: 'History status updated successfully' });
  });
});

app.post(api + '/history-status', authenticate, (req, res) => {
  const { history_id, status } = req.body;

  if (!history_id || typeof status === 'undefined') {
    return res.status(400).json({ error: 'Missing required fields: history_id and status' });
  }

  const query = 'UPDATE history SET status = ? WHERE history_id = ?';
  
  pool.query(query, [status, history_id], (err, result) => {
    if (err) {
      console.error('Error updating history status:', err);
      return res.status(500).json({ error: 'Failed to update history status' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No history record found with the given ID' });
    }

    res.status(200).json({ message: 'History status updated successfully' });
  });
});


app.post(api + "/history", authenticate, (req, res) => {
  const { selectedPersonId } = req.body;

  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'
  
  // Log for debugging
  console.log("Authorization Header:", authHeader);
  console.log("Token:", token);

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  // Verify the token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err.message);
      return res.status(403).json({ message: "Invalid token" });
    }

    // Proceed with the rest of the logic if token is valid
    if (!selectedPersonId) {
      return res.status(400).json({ message: "selectedPersonId is required" });
    }

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting database connection:", err);
        return res.status(500).json({ message: "Database error" });
      }

      // Fetch the history records
      const sql = "SELECT * FROM history WHERE person_id = ? ORDER BY history_id DESC";
      connection.query(sql, [selectedPersonId], async (err, results) => {
        if (err) {
          connection.release();
          console.error("Error executing database query:", err);
          return res.status(500).json({ message: "Database error" });
        }

        // If no records found, respond with a 404 status
        // if (results.length === 0) {
        //   connection.release();
        //   return res.status(404).json({ message: "No data found for the given person_id" });
        // }

        // Count the total number of records
        const countSql = "SELECT COUNT(*) AS totalCount FROM history WHERE person_id = ?";
        connection.query(countSql, [selectedPersonId], async (err, countResult) => {
          connection.release();

          if (err) {
            console.error("Error executing count query:", err);
            return res.status(500).json({ message: "Database error" });
          }

          const totalCount = countResult[0].totalCount;

          // Send the records and the count in the response
          res.json({ data: results, totalCount });
          console.log("Fetched Data:", results);
        });
      });
    });
  });
});

const checkAndSendEmails = () => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return;
    }

    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000); // 30 minutes ago

    // Fetch records within the last 30 minutes where email has not been sent
    const sql = `
      SELECT * 
      FROM history 
      WHERE scheduledDate >= ? 
      AND emailSent = FALSE
    `;
    connection.query(sql, [thirtyMinutesAgo], async (err, results) => {
      if (err) {
        console.error("Error executing database query:", err);
        connection.release();
        return;
      }
      console.log(results);

      if (results.length > 0) {
        for (const record of results) {
          const { note, scheduleddate, email } = record; // Extract note and scheduleddate for each record

          const mailOptions = {
            from: `"BITLINKS" <${process.env.EMAIL_USER}>`,
            to: email, // Change this to your recipient
            subject: "Upcoming Event Reminder",
            text: `You have an event rescheduled within the next 30 minutes about ${note} on ${new Date(scheduleddate).toLocaleString()}.`,
          };

          try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');

            // Update records to set emailSent to TRUE
            const updateSql = "UPDATE history SET emailSent = TRUE WHERE history_id = ?";
            connection.query(updateSql, [record.history_id], (err) => {
              if (err) {
                console.error("Error updating emailSent status:", err);
              }
            });

          } catch (error) {
            console.error('Error sending email:', error);
          }
        }
      }

      connection.release();
    });
  });
};

// Schedule the task to run every minute
cron.schedule('* * * * *', () => {
  console.log('Checking for upcoming events...');
  checkAndSendEmails();
});



app.get(api + '/addressdata', authenticate, (req,res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }
    const sql = "SELECT * FROM address_table";
    connection.query(sql, (err, results) =>{
      connection.release();
      if (err) {
        console.error("Error executing database query:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json(results);
    });
  });
});

   app.put(api + '/updatestatusaddress', authenticate, (req, res) => {
  const { id, status } = req.body;
  const query = 'UPDATE address_table SET status = ? WHERE id = ?';

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    connection.query(query, [status, id], (err, results) => {
      connection.release(); // Release the connection back to the pool
      if (err) {
        console.error('Error updating status:', err);
        return res.status(500).json({ message: 'Error updating status.' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Address not found.' });
      } else {
        res.json({ message: 'Status updated successfully.' });
      }
    });
  });
});

app.post(api + '/addresspost', authenticate, (req,res) => {
  const {location} = req.body;
  // console.log(req.body);

  pool.getConnection((err, connection) => {
    if(err){
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }
    const query = "INSERT INTO address_table (address_column) VALUES (?)";
    connection.query(query, [location],(err, results) => {
      connection.release();
      if (err) {
        console.error('Error updating status:', err);
        return res.status(500).json({ message: 'Error updating status.' });
      }
      // results.json({ message: 'Status updated successfully.' });
    });
  });
});

app.get(api + '/companydata', authenticate, (req,res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }
    const sql = "SELECT * FROM company_table";
    connection.query(sql, (err, results) =>{
      connection.release();
      if (err) {
        console.error("Error executing database query:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json(results);
    });
  });
});

app.put(api + '/updatestatuscompany', authenticate, (req, res) => {
  const { id, status } = req.body;
  const query = 'UPDATE company_table SET status = ? WHERE id = ?';

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    connection.query(query, [status, id], (err, results) => {
      connection.release(); // Release the connection back to the pool
      if (err) {
        console.error('Error updating status:', err);
        return res.status(500).json({ message: 'Error updating status.' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Address not found.' });
      } else {
        res.json({ message: 'Status updated successfully.' });
      }
    });
  });
});

// server.js
app.post(api + '/update-status', authenticate, (req, res) => {
  const { history_id } = req.body; // Get the history_id from the request body

  if (!history_id) {
    return res.status(400).json({ message: 'History ID is required' });
  }

  const query = 'UPDATE history SET status = 0 WHERE history_id = ?';

  pool.query(query, [history_id], (err, result) => {
    if (err) {
      console.error('Database update error:', err);
      return res.status(500).json({ message: 'Failed to update status' });
    }

    res.status(200).json({ message: 'Status updated successfully' });
  });
});
app.post(api + '/update-status', authenticate, (req, res) => {
  const { history_id, status } = req.body;

  if (!history_id || status === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = 'UPDATE history SET status = ? WHERE history_id = ?';
  pool.query(query, [status, history_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update status' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ message: 'Status updated successfully' });
  });
});


app.post(api + '/companypost', authenticate, (req,res) => {
  const {company} = req.body;
  // console.log(req.body);

  pool.getConnection((err, connection) => {
    if(err){
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }
    const query = "INSERT INTO company_table (company_column) VALUES (?)";
    connection.query(query, [company],(err, results) => {
      connection.release();
      // results.json({ message: 'Status updated successfully.' });
    });
  });
});

app.get(api + '/domaindata', authenticate, (req,res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }
    const sql = "SELECT * FROM domain_table";
    connection.query(sql, (err, results) =>{
      connection.release();
      if (err) {
        console.error("Error executing database query:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json(results);
    });
  });
});

app.put(api + '/updatestatusdomain', authenticate, (req, res) => {
  const { id, status } = req.body;
  const query = 'UPDATE domain_table SET status = ? WHERE id = ?';

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    connection.query(query, [status, id], (err, results) => {
      connection.release(); // Release the connection back to the pool
      if (err) {
        console.error('Error updating status:', err);
        return res.status(500).json({ message: 'Error updating status.' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Address not found.' });
      } else {
        res.json({ message: 'Status updated successfully.' });
      }
    });
  });
});

app.post(api + '/domainpost', authenticate, (req,res) => {
  const {domain} = req.body;
  // console.log(req.body);

  pool.getConnection((err, connection) => {
    if(err){
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }
    const query = "INSERT INTO domain_table (domain_column) VALUES (?)";
    connection.query(query, [domain],(err, results) => {
      connection.release();
      if (err) {
        console.error('Error updating status:', err);
        return results.status(500).json({ message: 'Error updating status.' });
      }
      // results.json({ message: 'Status updated successfully.' });
    });
  });
});

app.get(api + '/roledata', authenticate, (req,res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }
    const sql = "SELECT * FROM role_table";
    connection.query(sql, (err, results) =>{
      connection.release();
      if (err) {
        console.error("Error executing database query:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json(results);
    });
  });
});

app.put(api + '/updatestatusrole', authenticate, (req, res) => {
  const { id, status } = req.body;
  const query = 'UPDATE role_table SET status = ? WHERE id = ?';

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    connection.query(query, [status, id], (err, results) => {
      connection.release(); // Release the connection back to the pool
      if (err) {
        console.error('Error updating status:', err);
        return res.status(500).json({ message: 'Error updating status.' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Address not found.' });
      } else {
        res.json({ message: 'Status updated successfully.' });
      }
    });
  });
});

app.post(api + '/rolepost', authenticate, (req, res) => {
  const { role } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const query = "INSERT INTO role_table (role_column) VALUES (?)";
    connection.query(query, [role], (err, results) => {
      connection.release();

      if (err) {
        console.error('Error inserting role:', err);
        return res.status(500).json({ message: 'Error inserting role.' });
      }

      return res.json({ message: 'Role inserted successfully.', id: results.insertId });
    });
  });
});

app.get(api + '/skilldata', authenticate, (req,res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }
    const sql = "SELECT * FROM skillset_table";
    connection.query(sql, (err, results) =>{
      connection.release();
      if (err) {
        console.error("Error executing database query:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json(results);
    });
  });
});

app.put(api + '/updatestatusskill', authenticate, (req, res) => {
  const { id, status } = req.body;
  const query = 'UPDATE skillset_table SET status = ? WHERE id = ?';

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    connection.query(query, [status, id], (err, results) => {
      connection.release(); // Release the connection back to the pool
      if (err) {
        console.error('Error updating status:', err);
        return res.status(500).json({ message: 'Error updating status.' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Address not found.' });
      } else {
        res.json({ message: 'Status updated successfully.' });
      }
    });
  });
});

app.post(api + '/skillpost', authenticate, (req, res) => {
  const { skill } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const query = "INSERT INTO skillset_table (skillset_column) VALUES (?)";
    connection.query(query, [skill], (err, results) => {
      connection.release();

      if (err) {
        console.error('Error inserting role:', err);
        return res.status(500).json({ message: 'Error inserting role.' });
      }

      return res.json({ message: 'Role inserted successfully.', id: results.insertId });
    });
  });
});


app.get(api + '/logindata', authenticate, (req,res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }
    const sql = "SELECT * FROM login";
    connection.query(sql, (err, results) =>{
      connection.release();
      if (err) {
        console.error("Error executing database query:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json(results);
    });
  });
});

app.put(api + '/updatestatuslogin', authenticate, (req, res) => {
  const { id, status } = req.body;
  // console.log("Update login",req.body);
  const query = 'UPDATE login SET STATUS = ? WHERE ID = ?';

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    connection.query(query, [status, id], (err, results) => {
      connection.release(); // Release the connection back to the pool
      if (err) {
        console.error('Error updating status:', err);
        return res.status(500).json({ message: 'Error updating status.' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Address not found.' });
      } else {
        res.json({ message: 'Status updated successfully.' });
      }
    });
  });
});

app.post(api + '/loginpost', authenticate, (req, res) => {
  const { name, email } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const query = "INSERT INTO login (NAME, EMAIL) VALUES (?, ?)";
    connection.query(query, [name, email], (err, results) => {
      connection.release();

      if (err) {
        console.error('Error inserting role:', err);
        return res.status(500).json({ message: 'Error inserting role.' });
      }

      return res.json({ message: 'Login data inserted successfully.', id: results.insertId });
    });
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});