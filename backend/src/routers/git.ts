import { Router } from "express";
import { getGitRepoContents } from "../services/git";

const router = Router();
router.post("/new", async (req, res) => {
  const { repo } = req.body;
  const data = await getGitRepoContents(repo);
  res.json(data);
});

export default router;
