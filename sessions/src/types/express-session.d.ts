import express from "express-session";

declare module "express-session" {
  interface SessionData {
    userID: string;
  }
}
