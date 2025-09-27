import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import { Document } from "@langchain/core/documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";

dotenv.config();

const model = new BedrockChat({
  model: "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
  region: "us-east-2",
});

export const generateSummaryForFile = async (file: Document) => {
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
  console.log(formattedPrompt);
  const res = await model.invoke(formattedPrompt);
  return res.content;
};
