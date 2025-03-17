// models/GlobalSessionPricing.js
const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  duration: {
    type: String, // "30 minutes", "1 hour", etc.
    required: true
  },
  price: {
    type: Number, // 2200, 3800, etc.
    required: true
  }
});

const GlobalSessionPricingSchema = new mongoose.Schema({
  sessions: [SessionSchema] // Array of session options and prices
}, { timestamps: true });


const GlobalSessionPricing=mongoose.model('GlobalSessionPricing', GlobalSessionPricingSchema);
module.exports = GlobalSessionPricing;
