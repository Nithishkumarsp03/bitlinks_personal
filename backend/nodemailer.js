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
    from: `"BITLINKS" <nithishkumar.cs23@bitsathy.ac.in>`, // Sets "No-Reply" as the sender name
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
const receiverEmail = 'tharunkumar.me23@bitsathy.ac.in'; // Replace with the receiver's email address
const emailSubject = 'Upcoming schedule';
const emailMessage = `You have an reschedule`;

sendEmailNotification(receiverEmail, emailSubject, emailMessage);
