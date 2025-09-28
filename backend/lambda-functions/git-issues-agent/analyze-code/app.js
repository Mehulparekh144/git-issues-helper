const {
  GithubRepoLoader,
} = require("@langchain/community/document_loaders/web/github");
const { BedrockChat } = require("@langchain/community/chat_models/bedrock");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");
const mongoose = require("mongoose");

// Initialize AWS Bedrock clients
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-2",
});

const model = new BedrockChat({
  model: "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
  region: process.env.AWS_REGION || "us-east-2",
});

const bedrockEmbeddingModel = "amazon.titan-embed-text-v2:0";

// File filtering array (copied from your backend)
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

// MongoDB Schema (simplified for Lambda)
const fileSchema = new mongoose.Schema({
  summary: String,
  filePath: String,
  vector: [Number],
});

const gitSchema = new mongoose.Schema({
  repoURL: { type: String, required: true },
  name: String,
  files: [fileSchema],
});

const Git = mongoose.model("Git", gitSchema);

// AI Functions (copied from your backend)
const generateEmbedding = async (text) => {
  const response = await bedrockClient.send(
    new InvokeModelCommand({
      modelId: bedrockEmbeddingModel,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        inputText: text,
      }),
    })
  );

  const body = JSON.parse(Buffer.from(response.body).toString());
  return body.embedding;
};

const generateSummaryForFile = async (file) => {
  const prompt =
    ChatPromptTemplate.fromTemplate(`You are a senior software engineer specializing in technical documentation and knowledge transfer. Analyze the following code from {filePath} and provide a clear, concise technical explanation that would help a junior engineer understand the codebase.

Code Document:
{inputText}

Provide a technical summary that:
1. Describes the code's core functionality and purpose
2. Explains key technical concepts and patterns used
3. Identifies important architectural decisions
4. Notes critical implementation details

Keep your response under 100 words. Focus on technical accuracy and clarity while ensuring it's accessible to junior engineers.

Example Output:
The \`auth.ts\` module implements JWT-based authentication with Redis session management. The \`authenticateUser\` function handles credential validation and token generation. We use Redis for distributed session storage with a 24-hour TTL. The implementation follows the OAuth 2.0 specification and includes rate limiting for security. Key functions: \`authenticateUser\`, \`validateToken\`, \`refreshToken\`.
Please provide a similar technical summary for the provided code.`);

  const formattedPrompt = await prompt.format({
    inputText: file.pageContent,
    filePath: file.metadata.source,
  });

  const res = await model.invoke(formattedPrompt);
  return res.content;
};

// MongoDB connection
let cachedDb = null;
const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  const connection = await mongoose.connect(process.env.MONGO_URI);
  cachedDb = connection;
  return connection;
};

exports.lambdaHandler = async (event, context) => {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    const { repo } = JSON.parse(event.body);

    // Check if repo exists in database
    let repoData = await Git.findOne({ repoURL: repo });
    if (!repoData) {
      repoData = await Git.create({ repoURL: repo });
    }

    // Load GitHub repository
    const loader = new GithubRepoLoader(repo, {
      branch: "main",
      accessToken: process.env.GIT_TOKEN,
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

    const results = [];

    // Process files (limit to 10 for performance)
    for (const doc of docs.slice(0, 10)) {
      // Generate AI summary
      const summary = await generateSummaryForFile(doc);

      // Generate embeddings
      const vector = await generateEmbedding(summary);

      // Save to MongoDB
      await Git.findOneAndUpdate(
        { repoURL: repo },
        {
          $push: {
            files: {
              summary: summary,
              filePath: doc.metadata.source,
              vector: vector,
            },
          },
        }
      );

      results.push({
        summary: summary,
        filePath: doc.metadata.source,
      });
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Analysis complete",
        summaries: results,
        filesProcessed: results.length,
      }),
    };
  } catch (err) {
    console.error("Lambda error:", err);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      }),
    };
  }
};
