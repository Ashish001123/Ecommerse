import express from "express";
import {
  addToCart,
  removeAllFromCart,
  updateQuantity,
  getCartProducts,
} from "../controller/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", protectRoute, getCartProducts);
router.post("/", protectRoute, addToCart);
router.delete("/:id", protectRoute, removeAllFromCart);
router.put("/:id", protectRoute, updateQuantity);

export default router;
