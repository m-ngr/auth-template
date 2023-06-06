import { Request, Response } from "express";
import User from "../models/user";
import { jwtVerify } from "../utils/auth";

export const getProfile = async (req: Request, res: Response) => {
  const token = req.cookies?.token;
  if (!token) return res.redirect("/login");

  try {
    const payload = jwtVerify(token);
    const user = await User.findById(payload.userID);
    if (!user) return res.redirect("/logout");
    res.render("profile", { username: user.username });
  } catch (error) {
    console.error(error);
    res.redirect("/login");
  }
};
