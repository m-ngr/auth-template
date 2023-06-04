require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import profileRoutes from "./routes/profile";
import authRoutes from "./routes/auth";
import path from "path";

const app = express();
const port = process.env.PORT || 4000;

const mongoClientP = mongoose
  .connect(process.env.MONGO_URI!)
  .then((m) => m.connection.getClient())
  .catch((err) => {
    console.error("Failed to connect to the database", err);
    process.exit(1);
  });

const sessionStore = MongoStore.create({
  clientPromise: mongoClientP,
  stringify: false,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    },
  })
);

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);
app.use(profileRoutes);

app.get("/", (req, res) => {
  if (req.session.userID) return res.redirect("/profile");
  res.redirect("/login");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: err });
});

app.listen(port, () => {
  console.log("Server is listening on port", port);
});
