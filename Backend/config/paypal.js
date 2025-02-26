// config/paypal.js
const paypal = require('paypal-rest-sdk');
require("dotenv").config();
paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox', // 'sandbox' for testing, 'live' for production
  client_id: process.env.PAYPAL_CLIENT_ID,     // set these in your environment variables
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

module.exports = paypal;
