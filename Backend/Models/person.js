const mongoose = require("mongoose");
const { type } = require("os");
const bcrypt = require("bcrypt");
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    // required:true
  },
  birthday: {
    type: Date,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (value) {
        const Tutor = require("./tutors"); // ✅ Require inside function to prevent circular dependency
        const existingTutor = await Tutor.findOne({ email: value });
        return !existingTutor;
      },
      message: "Email is already registered as a Tutor",
    },
  },
  // email: {
  //   type: String,
  //   unique: true,
  //   required: true,
  // },
  password: {
    type: String,
    // required:true
  },
  profilePicture: {
    type: String,
  },

  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  resetOTP: { 
    type: String 
  },
  otpExpires: { 
    type: Date 
  },
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "course" }],
});

personSchema.pre("save", async function (next) {
  const person = this;
  if (!person.isModified("password")) {
    return next();
  }

  try {
    const hashedPassword = await bcrypt.hash(person.password, 10);
    person.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

personSchema.pre("save", async function (next) {
  const person = this;
  if (person.role === "admin") {
    const existingAdmin = await mongoose
      .model("person")
      .findOne({ role: "admin" });
    if (
      existingAdmin &&
      existingAdmin._id.toString() !== person._id.toString()
    ) {
      return next(new Error("An admin already exists!"));
    }
  }
  next();
});

personSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};
const person = mongoose.model("person", personSchema);
module.exports = person;
