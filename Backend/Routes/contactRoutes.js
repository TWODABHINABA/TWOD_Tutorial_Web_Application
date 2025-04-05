const express = require("express");
const router = express.Router();
const Contact = require("../Models/contact");
const cors = require("cors");
const axios = require("axios");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Use SendGrid for better email delivery
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const getAIResponse = async (message) => {
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        contents: [{ role: "user", parts: [{ text: message }] }],
      },
      {
        headers: { Authorization: `Bearer ${process.env.GEMINI_API_KEY}` },
      }
    );

    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates.length > 0 &&
      response.data.candidates[0].content &&
      response.data.candidates[0].content.parts &&
      response.data.candidates[0].content.parts.length > 0
    ) {
      return response.data.candidates[0].content.parts[0].text;
    }
    return null; // AI response is empty
  } catch (error) {
    console.error("AI Response Error:", error.message);
    return null; // Prevents crash
  }
};

// SendGrid Email Function
const sendEmail = async (name, email, subject, message, aiResponse = null) => {
  try {
    const msg = {
      to: process.env.SENDER_EMAIL, // Send to support team
      from: process.env.COMPANY_EMAIL, // Must be an authorized business email
      subject: `New Contact Inquiry: ${subject}`,
      text: `Hello Support Team,\n\nA new contact form submission has been received.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}\n\nAI Response: ${
        aiResponse || "N/A"
      }\n\nBest regards,\nWall of Dreams Support Team`,
      replyTo: email, // Ensures no direct reply from users
      headers: {
        "X-Priority": "1", // High priority
        "X-MSMail-Priority": "High",
      },
    };

    await sgMail.send(msg);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email Sending Error:", error.response?.body || error.message);
  }
};

router.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  let aiResponse = await getAIResponse(message);

  if (!aiResponse) {
    // AI failed, save to database
    const newMessage = new Contact({ name, email, subject, message });
    await newMessage.save();
    await sendEmail(name, email, subject, message); // Send email to support
    return res.status(200).json({
      message:
        "Your message has been saved for support to review and emailed to our team.",
    });
  }

  // AI succeeded, send email with AI response
  await sendEmail(name, email, subject, message, aiResponse);
  res.status(200).json({ aiResponse });
});

// Get all stored messages (Admin use)
router.get("/contact/messages", async (req, res) => {
  const messages = await Contact.find().sort({ createdAt: -1 });
  res.json(messages);
});

module.exports = router;
