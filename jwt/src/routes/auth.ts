import express from "express";
import * as controller from "../controllers/auth";

const router = express.Router();

router.get("/signup", controller.getSignup);
router.post("/signup", controller.postSignup);
router.get("/login", controller.getLogin);
router.post("/login", controller.postLogin);
router.get("/logout", controller.getLogout);

export default router;
