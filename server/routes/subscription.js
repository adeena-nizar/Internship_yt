import express from "express";
import {
  getSubscriptions,
  createOrder,
  verifyPayment,
} from "../controllers/subscription.js";

const router = express.Router();

router.get("/", getSubscriptions);
router.post("/order", createOrder);
router.post("/verify", verifyPayment);

export default router;