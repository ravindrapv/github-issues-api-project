const express = require("express");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const issuesRouter = require("./routes/issues");

dotenv.config();

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/githubIssues-2", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/issues", issuesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ success: false, message: "Error" });
});

module.exports = app;
