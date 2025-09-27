"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSummaryForFile = void 0;
const bedrock_1 = require("@langchain/community/chat_models/bedrock");
const prompts_1 = require("@langchain/core/prompts");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const model = new bedrock_1.BedrockChat({
    model: "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
    region: "us-east-2",
});
const generateSummaryForFile = async (file) => {
    const prompt = prompts_1.ChatPromptTemplate.fromTemplate(`You are a senior software engineer specializing in technical documentation and knowledge transfer. Analyze the following code from {filePath} and provide a clear, concise technical explanation that would help a junior engineer understand the codebase.

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
    console.log(formattedPrompt);
    const res = await model.invoke(formattedPrompt);
    return res.content;
};
exports.generateSummaryForFile = generateSummaryForFile;
//# sourceMappingURL=ai.js.map