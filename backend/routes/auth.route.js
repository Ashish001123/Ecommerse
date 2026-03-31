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
import { requireDbConnection } from "../middleware/db.middleware.js";

router.post("/signup", requireDbConnection, signUpRoute);
router.post("/login", requireDbConnection, loginRoute);
router.post("/refresh-token", requireDbConnection, refreshToken);
router.post("/logout", logoutRoute);
router.get("/profile", requireDbConnection, protectRoute, getProfile);

export default router;
