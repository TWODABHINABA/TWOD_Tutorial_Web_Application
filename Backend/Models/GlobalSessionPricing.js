
const mongoose = require('mongoose');
const { type } = require("os");

const SessionSchema = new mongoose.Schema({
  duration: {
    type: String, 
    required: true
  },
  price: {
    type: String, 
    required: true
  }
});

const GlobalSessionPricingSchema = new mongoose.Schema({
  sessions: [SessionSchema] // Array of session options and prices
}, { timestamps: true });


const GlobalSessionPricing=mongoose.model('GlobalSessionPricing', GlobalSessionPricingSchema);
module.exports = GlobalSessionPricing;
