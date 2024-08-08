import { MailtrapClient } from "mailtrap";
import { ENV_VARS } from "../utils/envVars.js";

const TOKEN = ENV_VARS.MAILTRAP_TOKEN;
const ENDPOINT = ENV_VARS.MAILTRAP_ENDPOINT;

export const mailtrapClient = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Mailtrap Test",
};
