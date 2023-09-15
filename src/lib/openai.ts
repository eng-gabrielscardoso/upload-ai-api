import * as dotenv from "dotenv-safe";
import { OpenAI } from "openai";

dotenv.config();

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
