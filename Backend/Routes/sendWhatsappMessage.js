const twilio = require("twilio");
require("dotenv").config();

const accountSid = process.env.TWILIO_WHATSAPP_SID;
const authToken = process.env.TWILIO_WHATSAPP_AUTH;
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