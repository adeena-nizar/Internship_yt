import express from "express";
import {
  deletecomment,
  getallcomment,
  postcomment,
  editcomment,
  likecomment,
  dislikecomment,
  reportcomment,
  translatecomment,
} from "../controllers/comment.js";
import { moderateComment } from "../middleware/commentModeration.js";

const routes = express.Router();
routes.get("/:videoid", getallcomment);
routes.post("/postcomment", moderateComment, postcomment);
routes.delete("/deletecomment/:id", deletecomment);
routes.post("/editcomment/:id", editcomment);
routes.patch("/like/:id", likecomment);
routes.patch("/dislike/:id", dislikecomment);
routes.patch("/report/:id", reportcomment);
routes.post("/translate/:id", translatecomment);
export default routes;