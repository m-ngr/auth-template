require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import profileRoutes from "./routes/profile";
import authRoutes from "./routes/auth";
import path from "path";

const app = express();
const port = process.env.PORT || 4000;

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(authRoutes);

app.get("/", async (req, res) => res.redirect("/profile"));

app.use(profileRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: err });
});

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() =>
    app.listen(port, () => console.log("Server is listening on port", port))
  )
  .catch((err) => {
    console.error("Failed to connect to the database", err);
    process.exit(1);
  });
