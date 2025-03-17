const express = require("express");
const router = express.Router();
const GlobalSessionPricing = require("../Models/GlobalSessionPricing");
const authMiddleware = require("../Auth/Authentication");
require("dotenv").config();
require("../passport");
require("dotenv").config();

router.post("/add-session", async (req, res) => {
  try {
    const { sessions } = req.body;

    if (!Array.isArray(sessions) || sessions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Sessions array is required and cannot be empty",
      });
    }

    // Validate each session
    for (const session of sessions) {
      if (!session.duration || !session.price) {
        return res.status(400).json({
          success: false,
          message: "Each session must have duration and price",
        });
      }
    }

    // Find existing pricing
    let pricing = await GlobalSessionPricing.findOne();

    if (!pricing) {
      // If not exists, create new
      pricing = new GlobalSessionPricing({ sessions });
    } else {
      // If exists, replace sessions array
      pricing.sessions = sessions;
    }

    await pricing.save();

    res.status(201).json({
      success: true,
      message: "Global session pricing set successfully",
      data: pricing,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to set global session pricing",
    });
  }
});

router.get("/get-session", async (req, res) => {
  try {
    const pricing = await GlobalSessionPricing.findOne();

    if (!pricing) {
      return res
        .status(404)
        .json({ success: false, message: "Session pricing not set yet" });
    }

    res.json({ success: true, data: pricing });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch global session pricing",
    });
  }
});

router.put("/update/:index", authMiddleware, async (req, res) => {
  try {
    const { index } = req.params;
    const { duration, price } = req.body;

    // Fetch the existing pricing document
    const pricingDoc = await GlobalSessionPricing.findOne();
    if (!pricingDoc) {
      return res.status(404).json({
        success: false,
        message: "Global session pricing not found",
      });
    }

    // Check if index is valid
    if (index < 0 || index >= pricingDoc.sessions.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid session index",
      });
    }

    // Update specific session at the index
    pricingDoc.sessions[index] = { duration, price };

    // Save the updated document
    await pricingDoc.save();

    res.json({
      success: true,
      message: "Session updated successfully",
      data: pricingDoc.sessions[index], // return updated session only
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to update session",
    });
  }
});

// router.put("/update",authMiddleware, async (req, res) => {
//   try {
//     const { sessions } = req.body;

//     const updatedPricing = await GlobalSessionPricing.findOneAndUpdate(
//       {}, // No filter needed since only one exists
//       { sessions },
//       { new: true }
//     );

//     if (!updatedPricing) {
//       return res
//         .status(404)
//         .json({
//           success: false,
//           message: "Global session pricing not found to update",
//         });
//     }

//     res.json({
//       success: true,
//       message: "Global session pricing updated successfully",
//       data: updatedPricing,
//     });
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({
//         success: false,
//         message: "Failed to update global session pricing",
//       });
//   }
// });

module.exports = router;
