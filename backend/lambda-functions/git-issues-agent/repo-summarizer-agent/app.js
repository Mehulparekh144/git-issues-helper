  const { BedrockRuntimeClient, InvokeModelCommand } = await import(
    "@aws-sdk/client-bedrock-runtime"
  );
  
const model = new BedrockRuntimeClient({
    region: "us-east-2"
})

const systemPrompt = `
You are a senior software engineer specializing in technical documentation and knowledge transfer. Analyze the following code given and provide a clear, concise technical explanation that would help a junior engineer understand the codebase.

Provide a technical summary that:
1. Describes the code's core functionality and purpose
2. Explains key technical concepts and patterns used
3. Identifies important architectural decisions
4. Notes critical implementation details

Keep your response under 100 words. Focus on technical accuracy and clarity while ensuring it's accessible to junior engineers.

Example Output:
The \`auth.ts\` module implements JWT-based authentication with Redis session management. The \`authenticateUser\` function handles credential validation and token generation. We use Redis for distributed session storage with a 24-hour TTL. The implementation follows the OAuth 2.0 specification and includes rate limiting for security. Key functions: \`authenticateUser\`, \`validateToken\`, \`refreshToken\`.
Please provide a similar technical summary for the provided code.
`

export async function lambdaHandler(event, context) {
    try {
        const { content } = event
        console.log("Content:", content);
        const response = await model.send(new InvokeModelCommand({
            modelId: "us.anthropic.claude-3-5-sonnet-20240620-v1:0",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 1000,
                system: systemPrompt,
                messages: [
                    {
                        role: "user",
                        content: "This is the code document: " + content
                    }
                ]
            })
        }))
        const body = JSON.parse(Buffer.from(response.body).toString());
        return {
            statusCode: 200,
            body: JSON.stringify({
                summary: body.content[0].text
            })
        };
    } catch (err) {
        console.error("Lambda error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
}