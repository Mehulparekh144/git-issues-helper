import { Router } from "express";
import {
  getGitIssues,
  getGitRepoContents,
  getVectorForIssue,
} from "../services/git.js";
import { Git } from "../db/models/Git.js";

const router = Router();
router.post("/new", async (req, res) => {
  const { repo } = req.body;
  const data = await getGitRepoContents(repo);
  res.json(data);
});

router.get("/issues/:id", async (req, res) => {
  const { id } = req.params;
  const repo = await Git.findById(id);

  if (!repo) {
    return res.status(404).json({ message: "Repository not found" });
  }

  const data = await getGitIssues(repo.repoURL);
  return res.json(data);
});

router.post("/issues/summary", async (req, res) => {
  const { body, title } = req.body;

  const summary = await getVectorForIssue({
    body,
    title,
  });
  return res.json(summary);
});

export default router;
