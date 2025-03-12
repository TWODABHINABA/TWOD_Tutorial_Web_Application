const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
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

const FRONTEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://twod-tutorial-web-application-frontend.vercel.app"
    : "http://localhost:5173";

// CORS (Optional but recommended)
const cors = require("cors");
router.use(
  cors({
    origin: [FRONTEND_URL],
    credentials: true,
  })
);



// Passport initialization
router.use(passport.initialize());

// Routes
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
  if (!req.user) return res.redirect("/auth/callback/failure");

  const user = req.user;
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

  if (!user.password) {
    return res.redirect(
      `${FRONTEND_URL}/set-password?token=${token}&email=${encodeURIComponent(user.email)}`
    );
  }

  return res.redirect(
    `${FRONTEND_URL}/auth-success?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`
  );
});

router.post("/set-password", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Person.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/auth/callback/failure", (req, res) => {
  res.send("Error during Google login. Please try again.");
});

// router.use(passport.initialize());

// router.use(
//   cookieSession({
//     resave: false,
//     saveUninitialized: true,
//     secret: "secret",
//   })
// );
// router.use(passport.session());

// router.get("/", (req, res) => {
//   res.send("<button><a href='/auth'>Login With Google</a></button>");
// });

// router.get(
//   "/auth",
//   passport.authenticate("google", { scope: ["email", "profile"] })
// );

// router.get(
//   "/auth/callback",
//   passport.authenticate("google", {
//     successRedirect: "/auth/callback/success",
//     failureRedirect: "/auth/callback/failure",
//   })
// );




// router.get("/auth/callback/success", async (req, res) => {
//   if (!req.user) return res.redirect("/auth/callback/failure");

//   const user = req.user;
//   const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

//   if (!user.password) {

//     return res.redirect(
//       `https://twod-tutorial-web-application-frontend.vercel.app/set-password?token=${token}&email=${encodeURIComponent(user.email)}`
//     );
//   }

//   return res.redirect(
//     `https://twod-tutorial-web-application-frontend.vercel.app/auth-success?token=${token}&name=${encodeURIComponent(
//       user.name
//     )}&email=${encodeURIComponent(user.email)}`
//   );
// });

// router.post("/set-password", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await Person.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     user.password = password;

//     await user.save();

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       JWT_SECRET,
//       {
//         expiresIn: "1h",
//       }
//     );
//     res.json({ token, role: user.role });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });


// router.get("/auth/callback/failure", (req, res) => {
//   res.send("Error");
// });

// router.get("/auth/callback/success", async (req, res) => {
//   if (!req.user) return res.redirect("/auth/callback/failure");

//   const user = req.user;
//   const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

//   if (!user.password) {
//     const userPassword = req.query.password || null;

//     if (userPassword) {
//       const hashedPassword = await bcrypt.hash(userPassword, 10);
//       user.password = hashedPassword;
//       await user.save();
//     }
//   }

//   res.redirect(
//     `http://localhost:5173/auth-success?token=${token}&name=${encodeURIComponent(
//       user.name
//     )}&email=${encodeURIComponent(user.email)}`
//   );
// });




const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/register", upload.single("profilePicture"), async (req, res) => {
  const { name, phone, birthday, email, password, role } = req.body;
  const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

  const existingUser = await Person.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  if (role === "admin") {
    const adminExists = await Person.findOne({ role: "admin" });
    if (adminExists) {
      return res.status(400).json({ message: "An admin already exists!" });
    }
  }

  try {
    const newUser = new Person({
      name,
      phone,
      birthday,
      email,
      password,
      profilePicture,
      role: role || "user",
    });
    await newUser.save();
    res.status(200).json({ newUser });
  } catch (error) {
    res.status(400).json(error, "Internal Server Error");
  }
});

router.get("/check-admin", async (req, res) => {
  try {
    const admin = await Person.findOne({ role: "admin" });
    res.json({ adminExists: !!admin });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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
    const token = jwt.sign(
      { id: loginUser._id, role: loginUser.role },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.json({ token, role: loginUser.role });
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
      if (!user) {
        console.log("EROOOOOOOOOOOOOOOOOORORORORORORORORO");
        return res.status(404).json({ message: "User not found" });
      }
      console.log(user);
      res.json(user);
    } catch (error) {
      res.status(500).json(error, "Not Found");
    }
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

// router.get("/:id", authMiddleware, async (req, res) => {
//   try {
//     const userid = req.params.id;
//     const user = await Person.findById(userid).select("-password");
//     console.log(user);
//     res.json(user);
//   } catch (error) {
//     res.status(500).json(error, "Not Found");
//   }
// });

router.put(
  "/update/:id",
  authMiddleware,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = {};

      if (req.body.name) updates.name = req.body.name;
      if (req.body.phone) updates.phone = req.body.phone;
      if (req.body.birthday) updates.birthday = req.body.birthday;
      if (req.body.email) updates.email = req.body.email;

      if (req.file) {
        updates.profilePicture = "/uploads/" + req.file.filename;
      }

      const updatedUser = await Person.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User Not Found" });
      }

      res.status(200).json(updatedUser);
    } catch (err) {
      console.error("Error Updating Data", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

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
