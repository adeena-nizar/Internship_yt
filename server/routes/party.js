import express from "express";
import { createParty } from "../controllers/party.js";

const router = express.Router();

router.post("/create", createParty);

export default router;