const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyCp3BKQfwA_DFpZlktKIwt3egFcXQI3ylw"); // Use your actual API key

module.exports = { genAI };