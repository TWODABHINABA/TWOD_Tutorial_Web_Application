const twilio = require("twilio");

const accountSid = "AC906d02294bb0ad4946c9f0b44fb07aaf";
const authToken = "8da2b7da6609d350e8124ed2cd9dc378";
const client = twilio(accountSid, authToken);
const FROM_NUMBER = "whatsapp:+14155238886"; // Twilio sandbox or your WhatsApp business number

async function sendWhatsAppMessage(to, body) {
  if (!to) return;
  try {
    await client.messages.create({
      from: FROM_NUMBER,
      to: `whatsapp:${to}`,
      body,
    });
    console.log("WhatsApp message sent to:", to);
  } catch (err) {
    console.error("Error sending WhatsApp:", err);
  }
}
module.exports= sendWhatsAppMessage;