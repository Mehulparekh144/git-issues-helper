import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { generateSummaryForFile } from "./ai";

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
