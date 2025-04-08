const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // ✅ Use Gmail SMTP
      auth: {
        user: process.env.GMAIL_USER, // ✅ Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // ✅ Generated App Password
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📩 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

module.exports = sendEmail;
