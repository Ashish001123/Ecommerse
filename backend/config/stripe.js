import stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

export const stripe= new stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
}); 