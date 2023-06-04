import express from "express";
import { getProfile } from "../controllers/profile";

const router = express.Router();

router.get("/profile", getProfile);

export default router;
