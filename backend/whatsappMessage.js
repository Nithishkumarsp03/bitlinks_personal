const twilio = require('twilio');

// Replace these with your own Twilio Account SID, Auth Token, and WhatsApp number
const accountSid = 'AC00b5667c6bfdb451d5312903e8c89f5b';
const authToken = '504df48a80fd9eeefc56ebbccd657648';
const client = twilio(accountSid, authToken);

// Send a message using the Twilio client
client.messages
  .create({
    from: 'whatsapp:+14155238886', // Twilio sandbox WhatsApp number
    to: 'whatsapp:+918903342911', // Recipient's WhatsApp number
    body: 'Hello! This is a test message from Nithish kumar. Kindly please ignore',
  })
  .then(message => console.log(`Message sent with SID: ${message.sid}`))
  .catch(error => console.error('Error sending WhatsApp message:', error));
