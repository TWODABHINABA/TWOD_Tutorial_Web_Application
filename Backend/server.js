// server.js
const express = require("express");
const app = express();
const db = require("./db"); // your db connection file
const bodyParser = require("body-parser");
const cors = require("cors");
const compression = require("compression");
const personRoutes = require("./Routes/personRoutes");
const courseRoutes = require("./Routes/courseRoutes");
const tutorRoutes = require("./Routes/tutorRoutes");
const sessionRoutes = require("./Routes/sessionRoutes");
const searchRoutes = require("./Routes/searchRoutes");
const googleRoutes = require("./Routes/googleRoutes");
const contactRoutes = require("./Routes/contactRoutes");
const payLaterRoutes = require("./Routes/payLaterRoutes");
const assignmentRoutes = require("./Routes/assignmentRoutes");
require("./cron/autoReject");
const path = require("path");

app.use(express.json());

const allowedOrigins = [
  "https://twod-tutorial-web-application-phi.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/courseUploads", express.static(path.join(__dirname, "courseUploads")));

app.use("/", tutorRoutes);
app.use("/", personRoutes);
app.use("/", courseRoutes);
app.use("/", sessionRoutes);
app.use("/", searchRoutes);
app.use("/", googleRoutes);
app.use("/", contactRoutes);
app.use("/", payLaterRoutes);
app.use("/", assignmentRoutes);

app.use(compression());
app.listen(process.env.PORT || 6001, () =>
  console.log("Server is running on port 6001")
);
