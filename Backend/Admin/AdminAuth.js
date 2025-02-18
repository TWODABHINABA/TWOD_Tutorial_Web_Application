const jwt = require("jsonwebtoken");
module.exports = async (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Access denied. Only admin can perform this action." });
  }
  next();
};
