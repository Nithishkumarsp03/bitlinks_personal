const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

// Configure nodemailer transporter
console.log("Email: ",process.env.EMAIL_USER);
console.log("Password: ",process.env.APP_PASSWORD);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.APP_PASSWORD, // Your app-specific password
  },
});

// Function to send email
const sendEmailNotification = (toEmail, subject, message) => {
  const mailOptions = {
    from: `"Personalized skill" <nithishkumar.cs23@bitsathy.ac.in>`, // Sets "No-Reply" as the sender name
    to: toEmail, // Receiver's email address
    subject: subject, // Email subject
    text: message, // Email message in plain text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Example Usage: Sending an email
const receiverEmail = 'vikashini.fd23@bitsathy.ac.in'; // Replace with the receiver's email address
const emailSubject = 'Congratulations on Completing the python level 1 on P-Skill';
const emailMessage = `Dear VIKASHINI M,

You have succesfully Completed the Python level 1 from Department of Food Technology. In this regard we are pleased to have you on board to SSG.

If you have any queries regarding this contact,
NITHISH KUMAR S P,
Dept of CSE,
Phone: +918903342911

Warm regards,
Personalized Skill

`;

sendEmailNotification(receiverEmail, emailSubject, emailMessage);
