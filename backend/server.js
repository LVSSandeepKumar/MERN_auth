import express from "express";

import { ENV_VARS } from "./utils/envVars.js";
import { connectDB } from "./utils/connectDB.js";

import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
//Setup the express app
const app = express();
const PORT = ENV_VARS.PORT;

//Middleware functions
app.use(express.json()); //middleware to parse incoming requests with json payloads
app.use(cookieParser()); //middleware to parse incoming requests with cookies

app.use("/api/auth", authRoutes);

//Listen to the server at defined port
app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
    connectDB();
})