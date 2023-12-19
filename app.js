const express = require("express");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("./models/User");

const issuesRoutes = require("./routes/api/issues");
const authRoutes = require("./routes/api/auth");
dotenv.config();

const app = express();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.userId);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      console.error("Error during authentication:", error);
      return done(error, false);
    }
  })
);
app.use(passport.initialize());

mongoose.connect("mongodb://localhost:27017/githubIssues-2", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/issues", issuesRoutes);
app.use("/auth", authRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// 404 Middleware
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not Found" });
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.json({ success: false, message: "Error" });
});

module.exports = app;
