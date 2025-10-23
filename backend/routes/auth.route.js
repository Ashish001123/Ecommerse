import express from "express";
import {
  signUpRoute,
  loginRoute,
  refreshToken,
  logoutRoute,
  getProfile,
} from "../controller/auth.controller.js";
const router = express.Router();
import { protectRoute } from "../middleware/auth.middleware.js";

router.post("/signup", signUpRoute);
router.post("/login", loginRoute);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutRoute);
router.get("/profile", protectRoute, getProfile);

export default router;
