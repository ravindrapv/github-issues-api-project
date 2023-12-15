const express = require("express");
const axios = require("axios");
const router = express.Router();
const mongoose = require("mongoose");
// ravindrapv/linkedin-clone
const Issue = require("../models/Issue");
//post issue
router.post("/sync", async (req, res) => {
  const repoOwner = "ravindrapv";
  const repoName = "linkedin-clone";
  const batchSize = 3;

  try {
    const response = await axios.get(
      `https://api.github.com/repos/${repoOwner}/${repoName}/issues`,
      {
        headers: {
          Authorization:
            "Bearer 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",
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

// Get Issue Detail API
router.get("/:issue_id", async (req, res) => {
  const issueId = req.params.issue_id;

  try {
    const issue = await Issue.findOne({ id: issueId });

    if (!issue) {
      return res
        .status(404)
        .json({ success: false, message: "Issue not found" });
    }

    res.json({ success: true, issue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error retrieving issue" });
  }
});

// Update Issue Detail API
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
