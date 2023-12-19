const express = require("express");
const router = express.Router();
const { validateRequest } = require("../../middlewares/validation");
const verifyTokenAndRole = require("../../middlewares/auth.js");

const IssueService = require("../../services/issuesService");
const issueService = new IssueService();

router.post(
  "/sync",
  verifyTokenAndRole(["user", "admin"]),
  async (req, res, next) => {
    try {
      console.log(" from the route");
      const result = await issueService.syncIssuesWithLocalDB();
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: { message: error.message } });
    }
  }
);

router.get(
  "/:issue_id",
  verifyTokenAndRole(["user", "admin"]),
  async (req, res, next) => {
    try {
      const { issue_id } = req.params;
      const issue = await issueService.getIssueById(issue_id);
      res.json({ success: true, issue });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: { message: error.message } });
    }
  }
);

router.put(
  "/:issue_id",
  verifyTokenAndRole(["admin"]),
  async (req, res, next) => {
    try {
      const { issue_id } = req.params;
      const updatedIssueDetails = req.body;
      const updatedIssue = await issueService.updateIssueById(
        issue_id,
        updatedIssueDetails
      );
      res.json({ success: true, updatedIssue });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: { message: error.message } });
    }
  }
);

module.exports = router;
