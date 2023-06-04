import { Request, Response } from "express";
import User from "../models/user";

export const getProfile = async (req: Request, res: Response) => {
  if (req.session.userID) {
    try {
      const user = await User.findById(req.session.userID);
      if (!user) return res.redirect("/logout");
      res.render("profile", { username: user.username });
    } catch (error) {
      console.error(error);
      res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
};
