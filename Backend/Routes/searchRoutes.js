const express = require("express");
const router = express.Router();
const Course = require("../Models/course");
const Person = require("../Models/person");
const Tutor = require("../Models/tutors");
const Transaction = require("../Models/transaction");
const GlobalSessionPricing = require("../Models/GlobalSessionPricing");

// Global Search Route
// router.get("/search", async (req, res) => {
//   try {
//     const { query } = req.query;
//     if (!query) {
//       return res.status(400).json({ message: "Search query is required" });
//     }

    
//     const searchCondition = { $regex: query, $options: "i" };


//     const courses = await Course.find({
//       $or: [{ name: searchCondition }, { overview: searchCondition },{courseType: searchCondition}],
//     });

//     const categories=await Course.find({
//       $or :[{courseType:searchCondition}]
//     });
//     const persons = await Person.find({
//       $or: [{ name: searchCondition }, { email: searchCondition }],
//     }).select("-password");

//     const tutors = await Tutor.find({
//       $or: [{ name: searchCondition }, { description: searchCondition }, { subjects: searchCondition }],
//     });

//     const transactions = await Transaction.find({
//       status: searchCondition, 
//     }).populate("user courseId tutorId");

//     const sessionPricing = await GlobalSessionPricing.find({
//       "sessions.duration": searchCondition,
//     });

//     res.json({
//       courses,
//       categories,
//       persons,
//       tutors,
//       transactions,
//       sessionPricing,
//     });
//   } catch (error) {
//     console.error("Search Error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });


router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const searchCondition = { $regex: query, $options: "i" };

    let courses = [];
    let categories = [];
    let persons = [];
    let tutors = [];
    let transactions = [];
    let sessionPricing = [];


    if (query.toLowerCase() === "tutors") {
      tutors = await Tutor.find({}); 
    } 
    else {

      courses = await Course.find({
        $or: [{ name: searchCondition }, { overview: searchCondition }, { courseType: searchCondition }],
      });

      categories = await Course.find({
        $or: [{ courseType: searchCondition }],
      });

      persons = await Person.find({
        $or: [{ name: searchCondition }, { email: searchCondition }],
      }).select("-password");

      tutors = await Tutor.find({
        $or: [{ name: searchCondition }, { description: searchCondition }, { subjects: searchCondition }],
      });

      transactions = await Transaction.find({
        status: searchCondition,
      }).populate("user courseId tutorId");

      sessionPricing = await GlobalSessionPricing.find({
        "sessions.duration": searchCondition,
      });
    }

    res.json({
      courses,
      categories,
      persons,
      tutors,
      transactions,
      sessionPricing,
    });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;

