const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const Person = require("../Models/person");
const Tutor = require("../Models/tutors");
const { error } = require("console");
const authMiddleware = require("../Auth/Authentication");
const speakeasy = require("speakeasy");
const twilio = require("twilio");
const bcrypt = require("bcrypt");
const passport = require("passport");
// const cookieSession = require("cookie-session");
const cookieSession = require("express-session");
require("../passport");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);

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
  if (!req.user) return res.redirect("/auth/callback/failure");

  const user = req.user;
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

  if (!user.password) {
    return res.redirect(
      `https://twod-tutorial-web-application-phi.vercel.app/set-password?token=${token}&email=${encodeURIComponent(
        user.email
      )}` ||
        `http://localhost:5173/set-password?token=${token}&email=${encodeURIComponent(
          user.email
        )}`
      // `https://twod-tutorial-web-application-phi.vercel.app/set-password?token=${token}&email=${encodeURIComponent(user.email)}` //Abhi
    );
  }

  return res.redirect(
    `https://twod-tutorial-web-application-phi.vercel.app/auth-success?token=${token}&name=${encodeURIComponent(
      user.name
    )}&email=${encodeURIComponent(user.email)}` ||
      `http://localhost:5173/auth-success?token=${token}&name=${encodeURIComponent(
        user.name
      )}&email=${encodeURIComponent(user.email)}`
  );
});

router.post("/set-password", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Person.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = password;

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
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
  },
});

const upload = multer({ storage: storage });

const isValidEmail = (email) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/.test(email);
const isValidPhone = (phone) => /^\d+$/.test(phone);
const isValidBirthday = (birthday) =>
  /^\d{4}-[A-Za-z]{3}-\d{2}$/.test(birthday);

router.post("/register", upload.single("profilePicture"), async (req, res) => {
  const { name, phone, birthday, email, password, role } = req.body;
  const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

  try {

    const existingUser = await Person.findOne({ email }) || await Tutor.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (role === "admin") {
      const adminExists = await Person.findOne({ role: "admin" });
      if (adminExists) {
        return res.status(400).json({ message: "An admin already exists!" });
      }
    }

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ message: "Invalid email format. Use '@something.com'." });
    }
    if (!isValidPhone(phone)) {
      return res
        .status(400)
        .json({ message: "Phone number must contain only digits." });
    }
    if (!isValidBirthday(birthday)) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Use 'YYYY-MMM-DD'." });
    }
    if (password.length < 3) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

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
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
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
  console.log("🔹 Login request received:", { email, password });

  try {
    let loginUser = await Tutor.findOne({ email });
    console.log("🔹 Tutor found:", loginUser);

    if (loginUser) {
      const isMatch = await bcrypt.compare(password, loginUser.password);
      console.log("🔹 Password match:", isMatch);

      if (!isMatch) {
        console.log("❌ Incorrect password");
        return res.status(400).json({ message: "Invalid Password" });
      }

      if (loginUser.isFirstLogin) {
        console.log("🛑 First login - Redirecting to set password");
        return res.status(403).json({
          message: "Set a new password",
          redirectTo: "/set-password-tutor",
        });
      }

      const token = jwt.sign(
        { id: loginUser._id, role: loginUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      console.log("✅ Tutor login successful!");
      return res.json({ token, role: loginUser.role });
    }

    loginUser = await Person.findOne({ email });
    console.log("🔹 Person found:", loginUser);

    if (!loginUser) {
      console.log("❌ Email not found");
      return res.status(400).json({ message: "Email not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, loginUser.password);
    console.log("🔹 Password match:", isPasswordMatch);

    if (!isPasswordMatch) {
      console.log("❌ Incorrect password");
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: loginUser._id, role: loginUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Person login successful!");
    res.json({ token, role: loginUser.role });
  } catch (error) {
    console.error("🔥 Login Error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// Route to handle setting a new password for tutors
router.post("/set-password-tutor", async (req, res) => {
  const { email, password } = req.body; // ✅ Match frontend variable names

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedTutor = await Tutor.findOneAndUpdate(
      { email },
      { password: hashedPassword, isFirstLogin: false },
      { new: true } // ✅ Return updated tutor
    );

    if (!updatedTutor) {
      return res.status(400).json({ message: "Tutor not found" });
    }

    res.json({
      message: "Password updated successfully! Please log in again.",
    });
  } catch (error) {
    console.error("Set Password Error:", error);
    res.status(500).json({ message: "Error updating password" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.user);
    try {
      const id = req.user.id;
      let user = await Person.findById(id).select("-password"); // Try fetching from Person schema

      if (!user) {
        user = await Tutor.findById(id).select("-password"); // If not found, fetch from Tutor schema
      }

      if (!user) {
        console.log("EROOOOOOOOOOOOOOOOOORORORORORORORORO");
        return res.status(404).json({ message: "User not found" });
      }

      console.log(user);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

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
      if (req.body.description) updates.description = req.body.description;
      if (req.body.subjects) updates.subjects = req.body.subjects.split(","); // Convert to array

      if (req.file) {
        updates.profilePicture = "/uploads/" + req.file.filename;
      }

      let updatedUser = await Person.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true }
      );

      if (!updatedUser) {
        updatedUser = await Tutor.findByIdAndUpdate(
          id,
          { $set: updates },
          { new: true }
        );
      }

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

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    let user = await Person.findOne({ email });
    if(!user){
      user = await Tutor.findOne({ email });
    }

    if (!user || !user.phone) {
      return res
        .status(404)
        .json({ message: "User not found or phone number not registered" });
    }

    const maskedPhone = `******${user.phone.slice(-2)}`;

    res.json({ maskedPhone });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

const formatPhoneNumber = (phone) => {
  if (!phone.startsWith("+")) {
    return `+91${phone}`; // Assuming India (+91), change as needed
  }
  return phone;
};
router.post("/verify-phone", async (req, res) => {
  try {
    const { email, phone } = req.body;
    let user = await Person.findOne({ email });

    if(!user){
      user = await Tutor.findOne({ email });
    }
    if (!user || user.phone !== phone) {
      return res.status(400).json({ message: "Invalid phone number" });
    }


    const formattedPhone = formatPhoneNumber(phone);


    const otp = speakeasy.totp({
      secret: process.env.OTP_SECRET || "secret",
      encoding: "base32",
      step: 60, 
    });


    user.resetOTP = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; 
    await user.save();

    console.log("Twilio number", process.env.TWILIO_PHONE_NUMBER);
    console.log("+91 number", formattedPhone);

    await client.messages.create({
      body: `Your OTP for verification is: ${otp}. It is valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    res.json({ message: "OTP sent successfully to your phone" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    let user = await Person.findOne({ email });

    if(!user){
      user = await Tutor.findOne({ email });
    }

    if (!user || !user.resetOTP || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    if (user.resetOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    let user = await Person.findOne({ email });
    if(!user){
      user = await Tutor.findOne({ email })
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res
        .status(400)
        .json({ message: "New Password must be different from the older one" });
    }

    // Hash new password
    console.log(newPassword);
    console.log(user.role);
    if(user.role==="tutor"){
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password=hashedPassword;
    }
    else{
      user.password = newPassword;
    }
    user.resetOTP = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
module.exports = router;

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const loginUser = await Person.findOne({ email });

//     if (!loginUser) {
//       const loginUser = await Tutor.findOne({ email });
//       if (!loginUser)
//         return res.status(400).json({ message: "Email not found" });
//       const isMatch = await bcrypt.compare(password, loginUser.password);
//       if (!isMatch)
//         return res.status(400).json({ message: "Invalid Password" });
//       if (loginUser.isFirstLogin) {
//         return res
//           .status(401)
//           .json({
//             message: "Set a new password",
//             redirectTo: "/set-password-tutor",
//           });
//       }
//     } else {
//       const isPasswordMatch = await loginUser.comparePassword(password);

//       if (!isPasswordMatch) {
//         return res.status(400).json({ message: "Invalid Password" });
//       }
//     }
//     const token = jwt.sign(
//       { id: loginUser._id, role: loginUser.role },
//       JWT_SECRET,
//       {
//         expiresIn: "1h",
//       }
//     );

//     res.json({ token, role: loginUser.role });
//   } catch (error) {
//     res.status(500).json({ message: "Error logging in" });
//   }
// });

// router.post("/set-password-tutor", async (req, res) => {
//   const { email, newPassword } = req.body;
//   const hashedPassword = await bcrypt.hash(newPassword, 10);

//   await Tutor.findOneAndUpdate(
//     { email },
//     { password: hashedPassword, isFirstLogin: false }
//   );

//   res.json({ message: "Password updated successfully!" });
// });

// router.get("/me", authMiddleware, async (req, res) => {
//   if (req.isAuthenticated()) {
//     console.log(req.user);
//     try {
//       const id = req.user.id;
//       const user = await Person.findById(id).select("-password");
//       if(!user){
//         const user=await Tutor.findById(id).select("-password");
//       }
//       if (!user) {
//         console.log("EROOOOOOOOOOOOOOOOOORORORORORORORORO");
//         return res.status(404).json({ message: "User not found" });
//       }
//       console.log(user);
//       res.json(user);
//     } catch (error) {
//       res.status(500).json(error, "Not Found");
//     }
//   } else {
//     res.status(401).json({ message: "Not authenticated" });
//   }
// });

// router.put(
//   "/update/:id",
//   authMiddleware,
//   upload.single("profilePicture"),
//   async (req, res) => {
//     try {
//       const { id } = req.params;
//       const updates = {};

//       if (req.body.name) updates.name = req.body.name;
//       if (req.body.phone) updates.phone = req.body.phone;
//       if (req.body.birthday) updates.birthday = req.body.birthday;
//       if (req.body.email) updates.email = req.body.email;

//       if (req.file) {
//         updates.profilePicture = "/uploads/" + req.file.filename;
//       }

//       const updatedUser = await Person.findByIdAndUpdate(
//         id,
//         { $set: updates },
//         { new: true }
//       );

//       if (!updatedUser) {
//         return res.status(404).json({ error: "User Not Found" });
//       }

//       res.status(200).json(updatedUser);
//     } catch (err) {
//       console.error("Error Updating Data", err);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   }
// );
