# Git Issues Helper

An AI-powered tool that helps developers find relevant code files for GitHub issues using semantic search and vector embeddings.

## Overview

This project analyzes GitHub repositories, generates AI summaries of code files, creates vector embeddings, and enables semantic matching between GitHub issues and relevant code sections.

## Architecture

- **Backend**: Node.js/Express with TypeScript
- **AI Models**: AWS Bedrock (Claude 3.5 Sonnet for summaries, Titan for embeddings)
- **Database**: MongoDB for storing summaries and vectors
- **GitHub Integration**: Octokit for repository and issue analysis

## Features Implemented

### ✅ Repository Analysis

- GitHub repository loading with LangChain
- File filtering (excludes config files, dependencies, etc.)
- AI-powered code summarization using AWS Bedrock Claude

### ✅ AI Summarization

- Technical summaries for code files (under 100 words)
- Issue analysis with solution approaches
- Optimized prompts for junior engineer understanding

### ✅ Database Schema

- MongoDB collections for repositories, files, and issues
- Vector storage fields for embeddings (1536 dimensions)
- Relationship management between repos, files, and issues

### 🔄 In Progress

- Vector embedding generation using AWS Bedrock Titan
- Semantic search functionality
- Issue-to-code matching

## API Endpoints

### `POST /git/new`

Analyzes a GitHub repository and generates summaries

```json
{
  "repo": "https://github.com/username/repository"
}
```

### `GET /git/issues/:id`

Fetches GitHub issues for a repository

### `POST /git/issues/summary`

Generates AI summary for a GitHub issue

```json
{
  "title": "Bug title",
  "body": "Issue description"
}
```

## Technology Stack

- **LangChain**: For GitHub repository loading and AI workflows
- **AWS Bedrock**: Claude 3.5 Sonnet (summaries) + Titan (embeddings)
- **MongoDB**: Vector storage and data persistence
- **Express.js**: RESTful API server
- **TypeScript**: Type-safe development

## Environment Variables

```bash
GIT_TOKEN=your_github_personal_access_token
MONGO_URI=your_mongodb_connection_string
AWS_REGION=us-east-2
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
```

## Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Configure environment variables in `.env`

3. Start MongoDB (local or Atlas)

4. Enable AWS Bedrock model access for Titan embeddings

5. Run the server:

```bash
npm run dev
```

## AWS AI Agent Hackathon

This project demonstrates:

- Multi-model AWS Bedrock integration
- Autonomous AI agent capabilities
- Vector-based semantic search
- Real-world developer productivity solution
