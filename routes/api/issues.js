const express = require("express");
const router = express.Router();
const { validateRequest } = require("../../middlewares/validation");

const {
  syncIssuesWithLocalDB,
  getIssueById,
  updateIssueById,
} = require("../../services/issuesService");

// Sync API
router.post("/sync", async (req, res, next) => {
  try {
    await syncIssuesWithLocalDB();
    res.json({ success: true, message: "Sync completed successfully" });
  } catch (error) {
    next(error);
  }
});

// Get Issue Detail API
router.get("/:issue_id", async (req, res, next) => {
  try {
    const { issue_id } = req.params;
    const issue = await getIssueById(issue_id);
    res.json({ success: true, issue });
  } catch (error) {
    next(error);
  }
});

// Update Issue Detail API
router.put("/:issue_id", validateRequest, async (req, res, next) => {
  try {
    const { issue_id } = req.params;
    const updatedIssueDetails = req.body;
    const updatedIssue = await updateIssueById(issue_id, updatedIssueDetails);
    res.json({ success: true, updatedIssue });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
