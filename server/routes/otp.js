import express from "express";
import { verifyOtp } from "../controllers/otp.js";

const router = express.Router();

router.post("/verify-otp", verifyOtp);

export default router;