const axios = require("axios");
const Issue = require("../models/Issue");

class IssueService {
  async syncIssuesWithLocalDB() {
    const repoOwner = process.env.REPO_OWNER;
    const repoName = process.env.REPO_NAME;
    const batchSize = parseInt(process.env.BATCH_SIZE);

    console.log("From middleware");

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

          await Issue.findOneAndUpdate({ id: issue.id }, issue, {
            upsert: true,
          });
        });

        await Promise.all(promises);

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      return { success: true, message: "Sync completed successfully" };
    } catch (error) {
      console.error(error);
      throw new Error("Error syncing data");
    }
  }

  async getIssueById(issueId) {
    try {
      const issue = await Issue.findOne({ id: issueId });

      if (!issue) {
        throw new Error("Issue not found");
      }

      return { success: true, issue };
    } catch (error) {
      console.error(error);
      throw new Error("Error retrieving issue");
    }
  }

  async updateIssueById(issueId, updatedIssueDetails) {
    try {
      const updatedIssue = await Issue.findOneAndUpdate(
        { id: issueId },
        updatedIssueDetails,
        {
          new: true,
        }
      );

      if (!updatedIssue) {
        throw new Error("Issue not found");
      }

      return { success: true, updatedIssue };
    } catch (error) {
      console.error(error);
      throw new Error("Error updating issue");
    }
  }
}

module.exports = IssueService;
