import bcrypt from "bcryptjs";
import crypto from "crypto";

import User from "../models/user.model.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendForgotPasswordEmail, sendResetPasswordSuccessEmail } from "../mailtrap/emails.js";
import { ENV_VARS } from "../utils/envVars.js";

//Signup function
export const signup = async(req,res) => {
    try {
        //Read the signup credentials from request body
        const {email, password, name} = req.body;
        console.log(req.body);
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
        generateTokenAndSetCookie(user._id, res);
        //Send verification email
        await sendVerificationEmail(user.email, verificationToken);
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

//Function to verify email sent to user
export const verifyEmail = async(req,res) => {
    try {
        //Read the code from req body and find the user from our db
        const {code} = req.body;
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: {$gt: Date.now()}
        });
        if(!user) {
            return res.status(404).json({ message: "Invalid or expired code" });
        }
        //Update the user
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        sendWelcomeEmail(user.email, user.name);
        return res.status(200).json({ message: "Email Verfied successfully", 
            user: {
                ...user._doc,
                password: ""
            }
        })
    } catch (error) {
        //Error handling
        console.log(`Error in verifyEmail Controller, ${error.message}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

//Login function
export const login = async(req,res) => {
    try {
        //Read the login credentials from request body
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        //Check if user exist with the given email
        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({ message: "Invalid login credentials" });
        }
        //Check if the password is valid using bcrypt compare
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).json({ message: "Incorrect Password" });
        }
        //If all validation checks are passed, set the cookie
        generateTokenAndSetCookie(user._id, res);
        //Update the last login date of user
        user.lastLogin = new Date();
        await user.save();
        return res.status(200).json({ 
            message: "Login successful",
            user: {
                ...user._doc,
                password: ""
            }
         });
    } catch (error) {
        //Error handling
        console.log(`Error in login Controller, ${error.message}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

//Logout function
export const logout = async(req,res) => {
    try {
        //Clear the cookie and send response message
        res.clearCookie("jwt");
        return res.status(200).json({ message: "Logout Successful" });
    } catch (error) {
        //Error handling
        console.log(`Error in logout Controller, ${error.message}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

//Forgot Password function
export const forgotPassword = async(req,res) => {
    try {
        //Read user email from request body and find the user with that email
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({ message: "No user exists with the provided email "});
        }
        //Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //1 hour in ms
        //Update the user values and save the user
        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
        await user.save();
        //Send Forgot Password Email
        await sendForgotPasswordEmail(email, `${ENV_VARS.CLIENT_URL}/reset-password/${resetToken}`);
        return res.status(200).json({ message: "Reset Password Email sent successfully" });
    } catch (error) {
        //Error handling
        console.log(`Error in forgotPassword Controller, ${error.message}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

//Reset Password function
export const resetPassword = async(req,res) => {
    try {
        //Read token from params and password from body
        const {token} = req.params;
        const {password} = req.body;
        //Find the user with that token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiresAt: {$gt: Date.now()}
        });
        if(!user) {
            return res.status(404).json({ message: "Invalid or expired token" });
        }
        //Hash the password and update user fields
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        await user.save();
        //Send Reset Password Success email
        await sendResetPasswordSuccessEmail(user.email);
        return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        //Error handling
        console.log(`Error in resetPassword Controller, ${error.message}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}