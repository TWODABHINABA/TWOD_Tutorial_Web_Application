const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const multer=require("multer");
const path=require("path");
const router = express.Router();
const Person = require("../Models/person");
const { error } = require("console");
const authMiddleware = require("../Auth/Authentication");
const passport = require("passport");
// const cookieSession = require("cookie-session");
const cookieSession = require("express-session");
require("../passport");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

router.use(passport.initialize());

router.use(
  cookieSession({
    resave: false,
    saveUninitialized: true,
    secret: "secret",
  })
);
router.use(passport.session());

router.get("/", (req, res) => {
  res.send("<button><a href='/auth'>Login With Google</a></button>");
});

router.get(
  "/auth",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/auth/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/callback/success",
    failureRedirect: "/auth/callback/failure",
  })
);

router.get("/auth/callback/success", async (req, res) => {
  if (!req.user) res.redirect("/auth/callback/failure");
  const a = await req.user;
  console.log(a);
  res.send("successfully Logged in");
  // res.send(a.emails.value);
});

router.get("/auth/callback/failure", (req, res) => {
  res.send("Error");
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });


router.post("/register",upload.single("profilePicture"), async (req, res) => {
  const { name, phone, birthday, email, password } = req.body;
  const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const newUser = new Person({ name, phone, birthday, email, password, profilePicture });
    await newUser.save();
    res.status(200).json({ newUser });
  } catch (error) {
    res.status(400).json(error, "Internal Server Error");
  }
});

router.use("/uploads", express.static("uploads"));

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const loginUser = await Person.findOne({ email });
    const isPasswordMatch = await loginUser.comparePassword(password);
    if (!loginUser) {
      return res.status(400).json("Invalid Email");
    } else if (!isPasswordMatch) {
      return res.status(400).json("Invalid Password");
    }
    const token = jwt.sign({ id: loginUser._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.user);
    try {
      const id = req.user.id;
      const user = await Person.findById(id).select("-password");
      console.log(user);
      res.json(user);
    } catch (error) {
      res.status(500).json(error, "Not Found");
    }
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, birthday, email, password } = req.body;
    const userUpdate = await Person.findById(id);
    if (!userUpdate) {
      res.status(404).json(error, "User Not Found");
    }
    userUpdate.name = name;
    userUpdate.phone = phone;
    userUpdate.birthday = birthday;
    userUpdate.email = email;
    userUpdate.password = password;

    await userUpdate.save();
    res.status(200).json(userUpdate);
  } catch (err) {
    console.log("Error Saving Data");
    res.status(500).json(err, "Internal Server error");
  }
});

router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const user = await Person.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!user) {
      return res.status(404).json({ message: "Account not found" });
    }
    res.json({ message: "Account deleted" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting Account" });
  }
});
module.exports = router;
