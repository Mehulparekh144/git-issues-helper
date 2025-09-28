import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";
dotenv.config();
const model = new BedrockChat({
    model: "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
    region: "us-east-2",
});
export const generateSummaryForFile = async (file) => {
    const prompt = ChatPromptTemplate.fromTemplate(`You are a senior software engineer specializing in technical documentation and knowledge transfer. Analyze the following code from {filePath} and provide a clear, concise technical explanation that would help a junior engineer understand the codebase.

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
export const generateSummaryForIssue = async (issue) => {
    const prompt = ChatPromptTemplate.fromTemplate(`You are an AI assistant that analyzes GitHub issues and produces a clear technical approach that can guide resolution.  
Your output will later be vectorized and compared with code embeddings, so it must be contextually rich, precise, and directly tied to actionable code-related concepts.  

Guidelines:  
- Begin with a brief restatement of the issue in technical terms.  
- Then, describe in detail how one might approach solving it: debugging steps, relevant code areas, possible architectural considerations, or implementation strategies.  
- Use terminology and phrasing that would naturally align with how the problem connects to source code.  
- The explanation should be detailed enough to meaningfully match similar code vectors, but not overflow into an entire implementation.  
- Do not include filler, apologies, or unrelated commentary.  
- Focus purely on problem understanding and the pathway to a solution.  

Issue:  
{issue}  

Output format:  
Plain text, one well-structured technical explanation of how to approach or solve the issue.
`);
    const formattedPrompt = await prompt.format({
        issue: `${issue.title}\n${issue.body}`,
    });
    const res = await model.invoke(formattedPrompt);
    return res.content;
};
//# sourceMappingURL=ai.js.map