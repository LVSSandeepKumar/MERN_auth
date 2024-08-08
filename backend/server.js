import express from "express";
import { ENV_VARS } from "./utils/envVars.js";

const app = express();

const PORT = ENV_VARS.PORT;

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
})