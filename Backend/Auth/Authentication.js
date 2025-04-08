const jwt = require("jsonwebtoken");
const Person = require("../Models/person");
const Tutor=require("../Models/tutors");
module.exports = async (req, res, next) => {
  // const token = req.headers.authorization?.split(" ")[1];
  // if (!token) {
  //   return res.status(401).json({ message: "JWT must be provided" });
  // }
  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   const user = await Per.findById(decoded.id);

  //   if (!user) {
  //     return res.status(404).json({ message: "User not found" });
  //   }

  //   req.user = {
  //     id: user._id,
  //     name: user.name,
  //     role: user.role,
  //     profilePicture: user.profilePicture,
  //   }; 
  //   next();
  // } catch (error) {
  //   res.status(403).json({ message: "Invalid token" });
  // }


  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "JWT must be provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await Person.findById(decoded.id);

    if (!user) {
      user = await Tutor.findById(decoded.id); // 🔹 Check Tutor schema if not found in Person
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = {
      id: user._id,
      name: user.name,
      role: user.role,
      profilePicture: user.profilePicture,
    };

    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};
