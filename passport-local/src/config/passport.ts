import passport from "passport";
import { Strategy } from "passport-local";
import User from "../models/user";
import bcrypt from "bcrypt";

passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (!(await bcrypt.compare(password, user.password))) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser(function (user: any, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  /*
    this function will be called on every request.
    if we don't need to load the user on every call
    we can have only: done(null, id);
    and load the user only when we wanted to.
  */
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
