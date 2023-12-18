const express = require("express");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const issuesRouter = require("./routes/issues");

dotenv.config();

const app = express();

mongoose.connect("mongodb://localhost:27017/githubIssues-2", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const issuesRoutes = require("./routes/api/issues");
app.use("/api/issues", issuesRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  pino.error(err);
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
