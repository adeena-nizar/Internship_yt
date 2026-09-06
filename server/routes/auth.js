import express from "express";
import { login, updateprofile, updateTheme } from "../controllers/auth.js";
const routes = express.Router();

routes.post("/login", login);
routes.patch("/update/:id", updateprofile);
routes.patch("/update-theme/:id", updateTheme);

export default routes;