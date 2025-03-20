const express = require("express");
const app = express();
const db = require("./db");
const bodyParser = require("body-parser");
const cors=require("cors");
const personRoutes = require("./Routes/personRoutes");
const courseRoutes=require("./Routes/courseRoutes");
const tutorRoutes=require("./Routes/tutorRoutes");
const sessionRoutes=require("./Routes/sessionRoutes");
const searchRoutes=require("./Routes/searchRoutes");
const path = require('path');
// const paypalRoutes = require('./Routes/paypal');
app.use(express.json());

app.use(cors({ origin: "http://localhost:5173", credentials: true })); //Local
// app.use(cors({ origin: "https://twod-tutorial-web-application-frontend.vercel.app", credentials: true })); //Abhi

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/courseUploads', express.static(path.join(__dirname, 'courseUploads')));

app.use("/",tutorRoutes);
app.use("/", personRoutes);
app.use("/",courseRoutes);
app.use("/",sessionRoutes);
app.use("/",searchRoutes);
app.listen(process.env.PORT, () =>
  console.log("Server is running on port 6001")
);




// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true); // ✅ Allow if no origin (Postman) or origin is allowed
//     } else {
//       console.log("Blocked by CORS: ", origin); // Helpful debug log
//       callback(new Error('Not allowed by CORS')); // ❌ Block otherwise
//     }
//   },
//   credentials: true // ✅ If using cookies or sessions
// };

// app.use(cors(corsOptions))




// app.use(cors(
//   {
//     methods:["POST","GET","PUT","DELETE"],
//     credentials: true
//   }
// ));
// app.use("/uploads", express.static("uploads"));