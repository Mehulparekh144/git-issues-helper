  const { BedrockRuntimeClient, InvokeModelCommand } = await import(
    "@aws-sdk/client-bedrock-runtime"
  );
  
const model = new BedrockRuntimeClient({
    region: "us-east-2"
})

const systemPrompt = `You are a senior software engineer specializing in technical documentation and knowledge transfer. Analyze the following code given and provide a clear, concise technical explanation that would help a junior engineer understand the codebase.

Provide a technical summary that:
1. Describes the code's core functionality and purpose
2. Explains key technical concepts and patterns used
3. Identifies important architectural decisions
4. Notes critical implementation details

Keep your response under 100 words. Focus on technical accuracy and clarity while ensuring it's accessible to junior engineers.

Example Output:
The \`auth.ts\` module implements JWT-based authentication with Redis session management. The \`authenticateUser\` function handles credential validation and token generation. We use Redis for distributed session storage with a 24-hour TTL. The implementation follows the OAuth 2.0 specification and includes rate limiting for security. Key functions: \`authenticateUser\`, \`validateToken\`, \`refreshToken\`.
Please provide a similar technical summary for the provided code.`

export async function lambdaHandler(event, context) {
    try {
        const { content } = event
        console.log("Content:", content);
        // Construct the prompt in Llama 3 format
        const fullPrompt = `<|begin_of_text|><|start_header_id|>user<|end_header_id|>

${systemPrompt}

This is the code document: ${content}<|start_header_id|>assistant<|end_header_id|>

`
        
        const response = await model.send(new InvokeModelCommand({
            modelId: "us.meta.llama4-maverick-17b-instruct-v1:0",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                max_gen_len: 512,
                temperature: 0.5,
                top_p: 0.9,
                prompt: fullPrompt,
            })
        }))
        const body = JSON.parse(Buffer.from(response.body).toString());
        console.log("Body:", body);
        
        const summary = body.generation || "No summary generated";
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                summary: summary
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