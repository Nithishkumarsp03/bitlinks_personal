const express = require("express");
const bodyParser = require("body-parser");
const mysql = require('mysql2');
const multer = require("multer");
const fs = require("fs"); // Make sure this line is included
const path = require("path");
const app = express();
const cors = require("cors");
const pool = require("./config.js")
require('dotenv').config(); // Load environment variables
const auth = require('./auth.js')
const passport = require("passport");
const session = require("express-session");
const passportConfig = require("./passport.js")
const PORT = process.env.PORT;
const api = process.env.API;

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

const upload = multer({ storage });

// Create the uploads directory if it doesn't exist
const uploadsDir = "uploads/";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve static files from the uploads directory
app.use(api + "/uploads", express.static(path.join(__dirname, "uploads")));

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


app.post(api + "/check-connection", (req, res) => {
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

app.post(api + "/person", (req, res) => {
  const { personInfo, imagePath, email, Completion , TotalProgress} = req.body;
  // console.log("Completion = ",Completion);
  // console.log("Total Completion = ",TotalProgress);
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
        VALUES (?, NOW())`;

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
app.post(api + "/subconnections", (req, res) => {
  const { email, selectedPersonId, connectionInfo, imagePath, Completion, TotalProgress } =
    req.body;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // SQL query to insert data into the connections table
    let sql = `
      INSERT INTO personalinfo (useremail,fullname, phonenumber, age, email, linkedinurl, address, shortdescription, hashtags, Completion, overall_completion, sub_id)
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
        VALUES (?, NOW())`;

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

app.get(api + "/personalinfo/main/:personId", (req, res) => {
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
app.get(api + "/personalinfo/subconnections/:personId", (req, res) => {
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


app.get(api + "/userNetworks", (req, res) => {
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

app.post(api + "/userConnections", (req, res) => {
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

      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "No data found for the given email" });
      }

      res.json(results); // Return all results as an array
    });
  });
});

app.post(api + '/personstatus', (req, res) => {
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

app.post(api + '/networkranks', (req, res) => {

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


app.post(api + "/summary", (req, res) => {
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



app.get(api + "/persondata/:id", (req, res) => {
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
        if (results.length === 0) {
          res.status(404).json({ message: "Person not found." });
          return;
        }

        res.json(results[0]);
      }
    );
  });
});

app.post(api + "/experiencedata", (req, res) => {
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

app.post(api + "/companydata", (req, res) => {
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

app.get(api + "/expertisedata/:id", (req, res) => {
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

app.get(api + "/expertisedata/domains" , (req, res) => {

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

app.get(api + "/placementdata/:id", (req, res) => {
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

app.post(api + "/consultancydata", (req, res) => {
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

app.post(api + "/internshipdata", (req, res) => {
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

app.post(api + "/alumnidata", (req, res) => {
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

app.post(api + "/outcomedata", (req, res) => {
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

app.put(api + "/personupload", (req, res) => {
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

app.put(api + "/companyupload", (req, res) => {
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

app.put(api + "/alumniupload", (req, res) => {
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

app.put(api + "/outcomeupload", (req, res) => {
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

app.put(api + "/experienceupload", (req, res) => {
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

app.put(api + "/placementupload", (req, res) => {
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

app.put(api + "/consultancyupload", (req, res) => {
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

app.put(api + "/internshipupload", (req, res) => {
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

app.put(api + "/expertiseupload", (req, res) => {
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

app.post(api + '/addhistory', (req, res) => {
  const { selectedPersonId, username, type, note, purpose, points, scheduled_date,imagePath1, imagePath2, status } = req.body;
  // console.log(req.body);

  const query = `INSERT INTO history (person_id, agent, type, note,purpose, scheduleddate, visited1, visited2, points, status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  pool.query(query, [selectedPersonId, username, type, note, purpose, scheduled_date, imagePath1, imagePath2, points, status], (err, result) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ message: 'Failed to insert record.' });
    }
    res.status(200).json({ message: 'Record inserted successfully', newRecord: result.insertId });
  });
});

app.get(api + '/fetch-scheduled', (req, res) => {
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
app.post(api + '/schedule', (req, res) => {
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


app.post(api + '/history-status', (req, res) => {
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

app.post(api + '/history-status', (req, res) => {
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


app.post(api + "/history", (req, res) => {
  const { selectedPersonId } = req.body;

  if (!selectedPersonId) {
    return res.status(400).json({ message: "selectedPersonId is required" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Fetch the history records and count them in two separate queries
    const sql = "SELECT * FROM history WHERE person_id = ? ORDER BY history_id DESC";
    const countSql = "SELECT COUNT(*) AS totalCount FROM history WHERE person_id = ?";

    // Execute the first query to get the history records
    connection.query(sql, [selectedPersonId], (err, results) => {
      if (err) {
        connection.release();
        console.error("Error executing database query:", err);
        return res.status(500).json({ message: "Database error" });
      }

      // If no records found, respond with a 404 status
      if (results.length === 0) {
        connection.release();
        return res.status(404).json({ message: "No data found for the given person_id" });
      }

      // Execute the second query to get the count of records
      connection.query(countSql, [selectedPersonId], (err, countResult) => {
        connection.release();

        if (err) {
          console.error("Error executing count query:", err);
          return res.status(500).json({ message: "Database error" });
        }

        // Send the records and the count in the response
        res.json({ data: results, totalCount: countResult[0].totalCount });
      });
    });
  });
});

app.get(api + '/addressdata',(req,res) => {
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

   app.put(api + '/updatestatusaddress', (req, res) => {
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

app.post(api + '/addresspost', (req,res) => {
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

app.get(api + '/companydata',(req,res) => {
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

app.put(api + '/updatestatuscompany', (req, res) => {
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
app.post(api + '/update-status', (req, res) => {
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
app.post(api + '/update-status', (req, res) => {
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


app.post(api + '/companypost', (req,res) => {
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

app.get(api + '/domaindata',(req,res) => {
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

app.put(api + '/updatestatusdomain', (req, res) => {
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

app.post(api + '/domainpost', (req,res) => {
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

app.get(api + '/roledata',(req,res) => {
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

app.put(api + '/updatestatusrole', (req, res) => {
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

app.post(api + '/rolepost', (req, res) => {
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

app.get(api + '/skilldata',(req,res) => {
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

app.put(api + '/updatestatusskill', (req, res) => {
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

app.post(api + '/skillpost', (req, res) => {
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


app.get(api + '/logindata',(req,res) => {
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

app.put(api + '/updatestatuslogin', (req, res) => {
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

app.post(api + '/loginpost', (req, res) => {
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