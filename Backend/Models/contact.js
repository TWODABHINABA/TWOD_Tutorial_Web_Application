const mongoose = require("mongoose");
const { type } = require("os");

const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  aiResponse: String,
  createdAt: { type: Date, default: Date.now },
});

const contact = mongoose.model("contact", ContactSchema);
module.exports=contact;