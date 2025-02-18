const jwt = require("jsonwebtoken");
const Per = require("../Models/person");
module.exports=async(req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({ message: "JWT must be provided" });
    }
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        // req.user=decoded;
        const user = await Per.findById(decoded.id);
        req.user = { id: decoded.id, name: user.name , profilePicture: user.profilePicture};
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid token" });
    }
}
