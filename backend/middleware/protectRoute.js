import jwt from "jsonwebtoken";
import { ENV_VARS } from "../utils/envVars.js";
import User from "../models/user.model.js";

export const protectRoute = async(req,res,next) => {
    try {
        //Read the jwt token from request cookie
        const token = req.cookies["jwt"];
        console.log(token);
        if(!token) {
            return res.status(401).json({ message: "Unauthorized, no token provided" });
        }
        //Decode the token using jwt verify
        const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
        if(!decoded) {
            return res.status(403).json({ message: "Unauthorized, invalid or incorrect token provided" });
        }
        //Find the user with this token
        const user = await User.findById(decoded.userId).select("-password");
        if(!user) {
            return res.status(404).json({ message: "No user found" });
        }
        //Set the user to request 
        req.user = user;
        next();
    } catch (error) {
        //Error handling
        console.log(`Error in checkAuth Controller, ${error.message}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}