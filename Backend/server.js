const express = require("express");
const app = express();
const db = require("./db");
const bodyParser = require("body-parser");
const cors=require("cors");
const personRoutes = require("./Routes/personRoutes");
app.use(bodyParser.json());
app.use(cors());
app.use("/", personRoutes);
app.listen(process.env.PORT, () =>
  console.log("Server is running on port 6001")
);
