import express from "express";
import { ENV_VARS } from "./utils/envVars.js";
import { connectDB } from "./utils/connectDB.js";

//Setup the express app
const app = express();

const PORT = ENV_VARS.PORT;

//Listen to the server at defined port
app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
    connectDB();
})