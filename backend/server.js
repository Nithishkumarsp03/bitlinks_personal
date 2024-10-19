const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const multer = require("multer");
const fs = require("fs"); // Make sure this line is included
const path = require("path");
const app = express();
const cron = require("node-cron");
const cors = require("cors");
const pool = require("./config.js");
require("dotenv").config(); // Load environment variables
const auth = require("./auth.js");
const passport = require("passport");
// const moment = require('moment');
const session = require("express-session");
const passportConfig = require("./passport.js");
const nodemailer = require("nodemailer");
const PORT = process.env.PORT;
const api = process.env.API;
const SECRET_KEY = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const authenticate = require("./Authenticate.js");
const checkConnectionRoute = require("./checkConnection/checkConnection.js");
const uploadRoutes = require("./Uploaded/Upload.js");
const personRoutes = require("./PersonRoute/Person.js");
const subConnectionRoutes = require("./PersonRoute/SubConnection.js");
const personInfoIdRoutes = require("./PersonRoute/PersonInfoId.js");
const NetworkRoutes = require("./UserRoutes/UserNetworks.js");
const ConnectionRoutes = require("./UserRoutes/UserConnection.js");
const PersonStatusRoutes = require("./UserRoutes/PersonStatus.js");
const userRankRoutes = require("./UserRoutes/UserRanks.js");
const networkRankRoutes = require("./UserRoutes/NetworkRanks.js");
const SummaryRoutes = require("./UserRoutes/Summary.js");
const ExperienceDataRoutes = require("./FieldData/ExperienceData.js");
const PersonDataRoutes =require('./FieldData/PersonData.js');
const CompanyDataRoutes = require("./FieldData/CompanyData.js");
const ExpertiseDataRoutes = require("./FieldData/ExpertiseData.js");
const ExpertiseDomainRoutes = require("./FieldData/ExpertiseDomain.js");
const PlacementDataRoutes = require("./FieldData/PlacementData.js");
const ConsultancyDataRoutes = require("./FieldData/ConsultancyData.js");
const InternshipDataRoutes = require("./FieldData/InternshipData.js");
const AlumniDataRoutes = require("./FieldData/AlumniData.js");
const OutcomeDataRoutes = require("./FieldData/OutcomeData.js");
const PersonUploadRoutes = require('./UploadData/PersonUpload.js');
const CompanyUploadRoutes = require('./UploadData/CompanyUpload.js');
const AlumniUploadRoutes = require('./UploadData/AlumniUpload.js');
const OutcomeUploadRoutes = require('./UploadData/OutcomeUpload.js');
const ExperienceUploadRoutes = require('./UploadData/ExperienceUpload.js');
const PlacementUploadRoutes = require('./UploadData/PlacementUpload.js');
const ConsultancyUploadRoutes = require('./UploadData/ConsultancyUpload.js');
const InternshipUploadRoutes = require('./UploadData/InternshipUpload.js');
const ExpertiseUploadRoutes = require('./UploadData/ExpertiseUpload.js');
const FetchScheduledRoutes = require('./Calls/FetchScheduled.js');
const AddHistoryRoutes = require('./Calls/AddHistory.js');
const AddMinutes = require('./Calls/AddMinutes.js')
const ScheduleRoutes = require('./Calls/Schedule.js');
const HistoryStatusRoutes = require('./Calls/HistoryStatus.js');
const HistoryRoutes = require('./Calls/History.js');
const Minutes = require('./Calls/Minutes.js');
const UpdateMinutes = require('./PostRest/UpdateMinutesPost.js');
const UpdateSaveMinutes = require('./PostRest/UpdateSaveMinutes.js');
const AddressDataRoutes = require('./PostRest/AddressData.js');
const UpdateStatusAddressRoutes = require('./PostRest/UpdateStatusAddress.js');
const AddressPostRoutes = require('./PostRest/AddressPost.js');
const CompanyPostDataRoutes  = require('./PostRest/CompanyData.js');
const UpdateStatusCompanyRoutes = require('./PostRest/UpdateStatusCompany.js');
const UpdataStatusRoutes = require('./PostRest/UpdataStatus.js');
const CompanyPostRoutes = require('./PostRest/CompanyPost.js');
const DomainDataRoutes = require('./TableData/DomainData.js'); 
const UpdateStatusDomainRoutes = require('./PostRest/UpdateStatusDomain.js');
const DomainPostRoutes = require('./PostRest/DomainPost.js');
const RoleDataRoutes = require('./TableData/RoleData.js');
const UpdateStatusRoleRoutes = require('./PostRest/UpdateStatusRole.js');
const RolePostRoutes = require('./PostRest/RolePost.js');
const SkillDataRoutes = require('./TableData/SkillData.js');
const UpdateStatusSkillRoutes = require('./PostRest/UpdateStatusSkill.js');
const SkillPostRoutes = require('./PostRest/SkillPost.js');
const LoginDataRoutes = require('./TableData/LoginData.js');
const UpdateStatusLoginRoutes = require('./PostRest/UpdateStatusLogin.js');
const LoginPostRoutes = require('./PostRest/LoginPost.js');
const InteractionsRoutes = require('./PostRest/Interactions.js');
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

app.use(api, auth);

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
  service: "gmail",
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
app.post("/send-email", authenticate, (req, res) => {
  const { toEmail, subject, message } = req.body;

  // Get the token from the Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from 'Bearer <token>'

  // Log for debugging
  // console.log("Authorization Header:", authHeader);
  // console.log("Token:", token);

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
        console.error("Error sending email:", error);
        return res.status(500).send("Error sending email");
      }
      console.log("Email sent:", info.response);
      res.status(200).send("Email sent successfully");
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

app.use(api, checkConnectionRoute);
app.use(api, uploadRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(api, personRoutes);

app.use(api,subConnectionRoutes);
app.use(api, personInfoIdRoutes);

app.use(api,NetworkRoutes);
app.use(api,ConnectionRoutes);
app.use(api,PersonStatusRoutes);
app.use(api,userRankRoutes);
app.use(api,networkRankRoutes);
app.use(api,SummaryRoutes);

app.use(api,PersonDataRoutes);
app.use(api,ExperienceDataRoutes);
app.use(api,CompanyDataRoutes);
app.use(api,ExpertiseDataRoutes);
app.use(api,ExpertiseDomainRoutes);
app.use(api,PlacementDataRoutes);
app.use(api,ConsultancyDataRoutes);
app.use(api,InternshipDataRoutes);
app.use(api,AlumniDataRoutes);
app.use(api,OutcomeDataRoutes);


app.use(api,PersonUploadRoutes);
app.use(api,CompanyUploadRoutes);
app.use(api,AlumniUploadRoutes);
app.use(api,OutcomeUploadRoutes);
app.use(api,ExperienceUploadRoutes);
app.use(api,PlacementUploadRoutes);
app.use(api,ConsultancyUploadRoutes);
app.use(api,InternshipUploadRoutes);
app.use(api,ExpertiseUploadRoutes);


app.use(api,AddHistoryRoutes);
app.use(api,FetchScheduledRoutes);
app.use(api,ScheduleRoutes);
app.use(api,HistoryStatusRoutes);
app.use(api,HistoryRoutes);
app.use(api,Minutes);
app.use(api,AddMinutes);
app.use(api,UpdateMinutes);
app.use(api,UpdateSaveMinutes);
//-------------------------------------Wishes-------------------------------------------
const checkAndSendWishes = () => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return;
    }

    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
    const day = String(today.getDate()).padStart(2, "0");

    // Format today's month and day as MM-DD
    const formattedDate = `${month}-${day}`;

    // Query to fetch records where the month and day of DOB match today's month and day
    const sql = `
      SELECT dob, fullname, email
      FROM personalinfo
      WHERE DATE_FORMAT(dob, '%m-%d') = ?
    `;

    connection.query(sql, [formattedDate], async (err, results) => {
      if (err) {
        console.error("Error executing database query:", err);
        connection.release();
        return;
      }

      if (results.length > 0) {
        for (const record of results) {
          const { dob, fullname, email } = record;

          const mailOptions = {
            from: `"BITLINKS" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Warm Birthday Wishes from Bannari Amman Institute of Technology`,
            text: `
Dear ${fullname},

On behalf of the management, faculty, and students of Bannari Amman Institute of Technology, I would like to extend our warmest birthday wishes to you.

Your continued support and collaboration with us have been invaluable in fostering innovation, growth, and excellence in education. We truly appreciate your contributions to the industry and the opportunities you provide to bridge the gap between academia and real-world applications.

May this year bring you success, health, and happiness in all your endeavours. We look forward to strengthening our partnership and working together on many more impactful initiatives.

Wishing you a wonderful birthday and a prosperous year ahead!

Warm regards,
Bannari Amman Institute of Technology.
`,
          };

          try {
            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully for birthday wishes");
          } catch (error) {
            console.error("Error sending email:", error);
          }
        }
      }

      connection.release();
    });
  });
};
//--------------------------------Wishes------------------------------------------

//---------------------------------Mails--------------------------------------------
const checkAndSendEmails = () => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return;
    }

    const now = new Date();
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);

    // Fetch records from history and join with personalinfo to get the fullname
    const sql = `
      SELECT h.*, p.fullname 
      FROM history h
      JOIN personalinfo p ON h.person_id = p.person_id
      WHERE h.scheduledDate >= ? 
      AND h.scheduledDate <= ? 
      AND h.status = 1 
      AND h.emailSent = FALSE
    `;

    connection.query(sql, [now, thirtyMinutesFromNow], async (err, results) => {
      if (err) {
        console.error("Error executing database query:", err);
        connection.release();
        return;
      }

      if (results.length > 0) {
        for (const record of results) {
          const { agent, fullname, scheduleddate, email } = record; // Extract relevant fields

          // Format the scheduled date
          const formattedDate = new Date(scheduleddate).toLocaleString();

          // Construct the email options with dynamic content
          const mailOptions = {
            from: `"BITLINKS" <${process.env.EMAIL_USER}>`,
            to: email, // Recipient's email
            subject: "Upcoming Event Reminder",
            text: `
Dear ${agent || "Recipient"},

I hope this message finds you well. This is a kind reminder regarding the rescheduled call on ${formattedDate}, ensuring the smooth progress of collaboration with ${fullname}.
Thank you for your attention to this matter, and we appreciate your time.

Regards,
IECC
            `,
          };

          try {
            // Send email using the transporter
            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully for reminder");

            // Update records to set emailSent to TRUE
            const updateSql =
              "UPDATE history SET emailSent = TRUE WHERE history_id = ?";
            connection.query(updateSql, [record.history_id], (err) => {
              if (err) {
                console.error("Error updating emailSent status:", err);
              }
            });
          } catch (error) {
            console.error("Error sending email:", error);
          }
        }
      }

      connection.release(); // Release the connection back to the pool
    });
  });
};
//------------------------------Mails--------------------------------------------
// Schedule the task to run every minute
cron.schedule("* * * * *", () => {
  // console.log('Checking for upcoming events...');
  checkAndSendEmails();
});

cron.schedule("0 9 * * *", () => {
  checkAndSendWishes();
});

// cron.schedule('* * * * *', () => {
//   checkAndSendWishes();
// });
//-------------------------------Address-------------------------------------------
app.use(api,AddressDataRoutes);
app.use(api,UpdateStatusAddressRoutes);
app.use(api,AddressPostRoutes);
app.use(api,CompanyPostDataRoutes);
app.use(api,UpdateStatusCompanyRoutes); 
app.use(api,UpdataStatusRoutes);
app.use(api,CompanyPostRoutes);
app.use(api,DomainDataRoutes);
app.use(api,UpdateStatusDomainRoutes);
app.use(api,DomainPostRoutes);
app.use(api,RoleDataRoutes);
app.use(api,UpdateStatusRoleRoutes);
app.use(api,RolePostRoutes);
app.use(api,SkillDataRoutes);
app.use(api,UpdateStatusSkillRoutes);
app.use(api,SkillPostRoutes);
app.use(api,LoginDataRoutes);
app.use(api,UpdateStatusLoginRoutes);
app.use(api,LoginPostRoutes);
app.use(api,InteractionsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
