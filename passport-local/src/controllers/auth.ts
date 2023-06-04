import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import passport from "passport";

export const getSignup = (req: Request, res: Response) => {
  res.render("signup");
};

export const postSignup = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.redirect("/signup");
  }
};

export const getLogin = (req: Request, res: Response) => {
  res.render("login");
};

export const postLogin = passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
});

export const getLogout = (req: Request, res: Response) => {
  req.logout(() => res.redirect("/login"));
};
