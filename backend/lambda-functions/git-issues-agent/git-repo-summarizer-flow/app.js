import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { mongoose } from "mongoose";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

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
]


const repoJobSchema = new mongoose.Schema({
  repoURL: {
    type: String,
    required: true,
  },
  status: {
    type: [
      "getting-contents",
      "parsing-contents",
      "summarizing-contents",
      "completed",
      "failed",
    ],
    required: true,
  },
  jobId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const fileSchema = new mongoose.Schema({
  summary: {
    type: String,
  },
  filePath: {
    type: String,
  },
  vector: {
    type: [Number],
  },
});

const gitSchema = new mongoose.Schema({
  repoURL: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  files: {
    type: [fileSchema],
  },
});

const Git = mongoose.model("Git", gitSchema);


const RepoJob = mongoose.model("RepoJob", repoJobSchema);


export async function lambdaHandler(event, context) {
    try {
        const { repo } = event;
        
        await mongoose.connect(process.env.MONGODB_URI);
        
        const job = await RepoJob.create({
            repoURL: repo,
            status: "getting-contents",
            jobId: event.jobID || Date.now().toString()
        });

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
            await updateRepoJob(repo, "failed");
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "No files found in repository" }),
            };
        }

        const filteredDocs = filterTopFiles(docs, 50);
        
        await updateRepoJob(repo, "parsing-contents");

        const lambdaClient = new LambdaClient({ region: "us-east-2" });
        
        const processedFiles = [];
        const batchSize = 5;
        
        for (let i = 0; i < filteredDocs.length; i += batchSize) {
            const batch = filteredDocs.slice(i, i + batchSize);
            
            const batchPromises = batch.map(async (doc) => {
                try {
                    const summaryResponse = await lambdaClient.send(new InvokeCommand({
                        FunctionName: "repo-summarizer-agent",
                        Payload: JSON.stringify({
                            content: doc.pageContent
                        })
                    }));
                    
                    const summaryResult = JSON.parse(new TextDecoder().decode(summaryResponse.Payload));
                    
                    const vectorResponse = await lambdaClient.send(new InvokeCommand({
                        FunctionName: "vectorizer-agent",
                        Payload: JSON.stringify({
                            content: summaryResult.summary
                        })
                    }));
                    
                    const vectorResult = JSON.parse(new TextDecoder().decode(vectorResponse.Payload));
                    
                    return {
                        filePath: doc.metadata.source,
                        summary: summaryResult.summary,
                        vector: vectorResult.vector
                    };
                } catch (error) {
                    console.error(`Error processing file ${doc.metadata.source}:`, error);
                    return null;
                }
            });
            
            const batchResults = await Promise.all(batchPromises);
            processedFiles.push(...batchResults.filter(result => result !== null));
            
            // Wait for 30 seconds between batches
            if (i + batchSize < filteredDocs.length) {
                await new Promise(resolve => setTimeout(resolve, 30000));
            }
        }

        await updateRepoJob(repo, "summarizing-contents");

        const repoName = repo.split('/').pop().replace('.git', '');
        await Git.findOneAndUpdate(
            { repoURL: repo },
            {
                repoURL: repo,
                name: repoName,
                files: processedFiles
            },
            { upsert: true, new: true }
        );

        await updateRepoJob(repo, "completed");

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Repository processing completed",
                processedFiles: processedFiles.length,
                repoURL: repo
            }),
        };

    } catch (error) {
        console.error("Lambda error:", error);
        
        // Update status to failed
        if (event.repo) {
            await updateRepoJob(event.repo, "failed");
        }
        
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
}

// Function to filter and prioritize top files
function filterTopFiles(docs, limit) {
    // Priority order for file types
    const priorityExtensions = ['.ts', '.js', '.tsx', '.jsx', '.py', '.java', '.go', '.rs', '.cpp', '.c', '.cs', '.php', '.rb', '.swift', '.kt'];
    
    const scoredDocs = docs.map(doc => {
        const filePath = doc.metadata.source;
        const extension = filePath.substring(filePath.lastIndexOf('.'));
        const contentLength = doc.pageContent.length;
        
        let score = contentLength; 
        
        const extensionIndex = priorityExtensions.indexOf(extension);
        if (extensionIndex !== -1) {
            score += (priorityExtensions.length - extensionIndex) * 1000;
        }
        
        const fileName = filePath.split('/').pop().toLowerCase();
        if (fileName.includes('index') || fileName.includes('main') || fileName.includes('app')) {
            score += 5000;
        }
        
        return { doc, score };
    });
    
    return scoredDocs
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.doc);
}

async function updateRepoJob(repoURL, status) {
    const repoJob = await RepoJob.findOne({ repoURL });
    if (!repoJob) {
        await RepoJob.create({ repoURL, status });
    } else {
        await RepoJob.updateOne({ repoURL }, { $set: { status } });
    }
}