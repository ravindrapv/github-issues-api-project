const express = require("express");
const axios = require("axios");
const router = express.Router();
const mongoose = require("mongoose");
// ravindrapv/linkedin-clone
const Issue = require("../models/Issue");
router.post("/sync", async (req, res) => {
  const repoOwner = "ravindrapv";
  const repoName = "linkedin-clone";
  const batchSize = 3;

  try {
    const response = await axios.get(
      `https://api.github.com/repos/${repoOwner}/${repoName}/issues`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

    const issues = response.data;
    console.log(response.data);

    for (let i = 0; i < issues.length; i += batchSize) {
      const batch = issues.slice(i, i + batchSize);
      const promises = batch.map(async (issue) => {
        const validatedIssue = new Issue(issue);
        await validatedIssue.validate();

        await Issue.findOneAndUpdate({ id: issue.id }, issue, { upsert: true });
      });

      await Promise.all(promises);

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    res.json({ success: true, message: "Sync completed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error syncing data" });
  }
});

router.get("/", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;

    const totalIssues = await Issue.countDocuments();
    const totalPages = Math.ceil(totalIssues / pageSize);

    const issues = await Issue.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({
      success: true,
      page,
      pageSize,
      totalPages,
      totalIssues,
      issues,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.put("/:issue_id", async (req, res) => {
  const issueId = req.params.issue_id;
  const updatedIssueDetails = req.body;

  try {
    const updatedIssue = await Issue.findOneAndUpdate(
      { id: issueId },
      updatedIssueDetails,
      {
        new: true,
      }
    );

    if (!updatedIssue) {
      return res
        .status(404)
        .json({ success: false, message: "Issue not found" });
    }

    res.json({ success: true, updatedIssue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating issue" });
  }
});

module.exports = router;
