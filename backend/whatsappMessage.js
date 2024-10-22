const twilio = require('twilio');

// Replace these with your own Twilio Account SID, Auth Token, and WhatsApp number
const accountSid = '';
const authToken = '';
const client = twilio(accountSid, authToken);

// Send a message using the Twilio client
client.messages
  .create({
    from: 'whatsapp:', // Twilio sandbox WhatsApp number
    to: 'whatsapp:+91', // Recipient's WhatsApp number
    body: 'Hello! This is a test message from Nithish kumar. Kindly please ignore',
  })
  .then(message => console.log(`Message sent with SID: ${message.sid}`))
  .catch(error => console.error('Error sending WhatsApp message:', error));
