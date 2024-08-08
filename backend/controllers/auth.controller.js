import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

//Signup function
export const signup = async(req,res) => {
    //Read the signup credentials from request body
    const {email, password, name} = req.body;
    try {
        //Check if all credentials are entered
        if(!email || !password || !name) {
            return res.status(400).json({ message: "Please provide all the credentials" });
        }
        //Check if there is any existing user with the email
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({ message: "User with the email already exists" });
        }
        //If validation checks are passed, hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //Create a verification token
        const verificationToken = generateVerificationCode();
        //Create new user
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 6 * 60 * 60 * 1000 // 6 hours in ms
        });
        //Save the user to db
        await user.save();
        //Generate a token and set it to cookie
        generateTokenAndSetCookie(res, user._id);
        //Return the user to client
        return res.status(201).json({
            message: "User created successfully",
            user: {
                ...user._doc,
                password: ""
            }
        })
    } catch (error) {
        //Error handling
        console.log(`Error in signup Controller, ${error.stack}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

//Login function
export const login = async(req,res) => {
    try {
        
    } catch (error) {
        //Error handling
        console.log(`Error in login Controller, ${error.message}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

//Logout function
export const logout = async(req,res) => {
    try {
        
    } catch (error) {
        //Error handling
        console.log(`Error in logout Controller, ${error.message}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}