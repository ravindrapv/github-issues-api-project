const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: String,
});

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;
