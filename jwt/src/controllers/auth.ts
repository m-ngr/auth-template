import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import { jwtSign } from "../utils/auth";

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

export const postLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.redirect("/login");
    }

    res.cookie("token", jwtSign({ userID: user.id }), {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });
    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    res.redirect("/login");
  }
};

export const getLogout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.redirect("/login");
};
