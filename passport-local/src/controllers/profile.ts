import { Request, Response } from "express";

export const getProfile = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) return res.redirect("/login");

  if (!req.user) return res.redirect("/logout");
  res.render("profile", req.user);
};
