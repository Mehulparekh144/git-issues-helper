import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { generateSummaryForFile, generateSummaryForIssue } from "./ai.js";
import { Octokit } from "@octokit/rest";
import { Git } from "../db/models/Git.js";

const octokit = new Octokit({
  auth: process.env.GIT_TOKEN as string,
});

const IGNORE_FILES = [
  ".gitignore",
  ".env",
  "eslint.config.js",
  "next.config.js",
  "postcss.config.js",
  "prettier.config.js",
  "prettierignore",
  "prettier.config.mjs",
  "prettier.config.cjs",
  "node_modules",
  "package.json",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "tsconfig.json",
  "babel.config.js",
  ".eslintrc.js",
  ".prettierrc",
  "dist",
  "build",
  "requirements.txt",
  "Pipfile",
  "poetry.lock",
  "Pipfile.lock",
  "setup.py",
  "pyproject.toml",
  "__pycache__",
  "*.pyc",
  ".pylintrc",
  ".flake8",
  "mypy.ini",
  "pom.xml",
  "build.gradle",
  "settings.gradle",
  "*.iml",
  "target",
  "go.mod",
  "go.sum",
  "vendor",
  ".DS_Store",
  "Thumbs.db",
];

interface GitRepoContents {
  summary: string;
  filePath: string;
}

export const getGitRepoContents = async (
  repo: string
): Promise<GitRepoContents[]> => {
  const repoData = await Git.findOne({ repoURL: repo });

  if (!repoData) {
    await Git.create({ repoURL: repo });
  }

  const loader = new GithubRepoLoader(repo, {
    branch: "main",
    accessToken: process.env.GIT_TOKEN as string,
    recursive: true,
    maxRetries: 1,
    ignoreFiles: IGNORE_FILES,
    maxConcurrency: 5,
    unknown: "warn",
  });
  const docs = await loader.load();

  if (docs.length === 0) {
    throw new Error("No documents found");
  }

  const res = [];
  for (const doc of docs.slice(10, 20)) {
    const summary = await generateSummaryForFile(doc);
    // TODO: Generate vector for the summary
    // TODO: Save the summary to the database
    // Return nothing
    res.push({
      summary: summary as string,
      filePath: doc.metadata.source,
    });
  }

  return res;
};

export const getGitIssues = async (repoURL: string) => {
  const [owner, repo] = repoURL.split("github.com/")[1]?.split("/") ?? [];

  if (!owner || !repo) {
    throw new Error("Invalid repository URL");
  }
  const issues = await octokit.issues.listForRepo({
    repo,
    // state: "open",
    owner,
    per_page: 100,
  });
  return issues.data;
};

export const getVectorForIssue = async (issue: {
  body: string;
  title: string;
}) => {
  const summary = await generateSummaryForIssue(issue);
  //TODO: Get the vectors and save them to the database
  return summary as string;
};
