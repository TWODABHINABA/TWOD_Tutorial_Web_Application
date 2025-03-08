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

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
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
