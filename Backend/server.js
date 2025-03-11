const express = require("express");
const app = express();
const db = require("./db");
const bodyParser = require("body-parser");
const cors=require("cors");
const personRoutes = require("./Routes/personRoutes");
const courseRoutes=require("./Routes/courseRoutes");
const tutorRoutes=require("./Routes/tutorRoutes");
// const paypalRoutes = require('./Routes/paypal');
app.use(express.json());

// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
const allowedOrigins = [
  'http://localhost:5173', // Local dev
  // 'https://twod-tutorial-web-application.vercel.app', // Production frontend
  // 'https://twod-tutorial-web-application-tn27xfrr3.vercel.app',
  // 'https://twod-tutorial-web-applicati-git-2ee84e-vinays-projects-73cfc7f5.vercel.app'
  "https://twod-tutorial-web-application-frontend.vercel.app/",
  // "https://twod-tutorial-web-application.vercel.app/"
];
// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   // methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   // allowedHeaders: ['Content-Type', 'Authorization'], 
// }));
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // ✅ Origin allowed
    } else {
      callback(new Error('Not allowed by CORS')); 
    }
  },
  credentials: true 
};

app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors(
//   {
//     methods:["POST","GET","PUT","DELETE"],
//     credentials: true
//   }
// ));
app.use("/uploads", express.static("uploads"));

app.use("/",tutorRoutes);
app.use("/", personRoutes);
app.use("/",courseRoutes);
app.listen(process.env.PORT, () =>
  console.log("Server is running on port 6001")
);
