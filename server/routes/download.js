import express from "express";
const router = express.Router();
import { downloadVideo, getDownloadedVideos } from "../controllers/download.js";


router.post("/:videoId", downloadVideo);
router.get("/", getDownloadedVideos);

export default router;