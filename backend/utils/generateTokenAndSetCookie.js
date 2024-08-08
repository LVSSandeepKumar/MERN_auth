import jwt from "jsonwebtoken";
import { ENV_VARS } from "./envVars.js";

//Function to generate a token and set it to cookie
export const generateTokenAndSetCookie = (userId, res) => {
    // Create a token by using jwt sign method for the userId with our JWT_SECRET
    const token = jwt.sign({userId}, ENV_VARS.JWT_SECRET, {
        expiresIn : '7d'
    });
    //Send the cookie through the response headers
    res.cookie("jwt", token, {
        maxAge: 7*24*60*60*1000, //Maximum validity of cookie in milli-seconds
        httpOnly: true, // To protect from XSS (Cross-site-scriptiong) attacks
        sameSite: "strict", // To protect from CSRF(Cross-Site-Request-Forgery) attacks
        secure: ENV_VARS.NODE_ENV !== "development" //Secure only in production environment
    })

    return token;
};