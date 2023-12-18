const express = require("express");
const router = express.Router();
const { validateRequest } = require("../../middlewares/validation");
const verifyToken = require("../../middlewares/auth.js");

console.log(verifyToken());
const {
  syncIssuesWithLocalDB,
  getIssueById,
  updateIssueById,
} = require("../../services/issuesService");

router.post(
  "/sync",
  verifyToken(),

  async (req, res, next) => {
    try {
      console.log(" from the route");
      await syncIssuesWithLocalDB();
      res.json({ success: true, message: "Sync completed successfully" });
    } catch (error) {
      // next(error);
      res.send({ error: error });
    }
  }
);

router.get("/:issue_id", verifyToken(), async (req, res, next) => {
  try {
    const { issue_id } = req.params;
    const issue = await getIssueById(issue_id);
    res.json({ success: true, issue });
  } catch (error) {
    next(error);
  }
});

router.put("/:issue_id", verifyToken(), async (req, res, next) => {
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
