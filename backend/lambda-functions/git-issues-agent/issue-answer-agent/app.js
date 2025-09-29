const { BedrockRuntimeClient, InvokeModelCommand } = await import(
    "@aws-sdk/client-bedrock-runtime"
  );
  
const model = new BedrockRuntimeClient({
    region: "us-east-2"
})

const systemPrompt = `
You are an AI assistant that analyzes GitHub issues and produces a clear technical approach that can guide resolution.  
Your output will later be vectorized and compared with code embeddings, so it must be contextually rich, precise, and directly tied to actionable code-related concepts.  

Guidelines:  
- Begin with a brief restatement of the issue in technical terms.  
- Then, describe in detail how one might approach solving it: debugging steps, relevant code areas, possible architectural considerations, or implementation strategies.  
- Use terminology and phrasing that would naturally align with how the problem connects to source code.  
- The explanation should be detailed enough to meaningfully match similar code vectors, but not overflow into an entire implementation.  
- Do not include filler, apologies, or unrelated commentary.  
- Focus purely on problem understanding and the pathway to a solution.  

Output format:  
Plain text, one well-structured technical explanation of how to approach or solve the issue.

`

export async function lambdaHandler(event, context) {
    try {
        const { content } = event
        console.log("Content:", content);

        const response = await model.send(
            new InvokeModelCommand({
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
                            content: "This is the issue: " + content
                        }
                    ]
                })
            })
        )
        const body = JSON.parse(Buffer.from(response.body).toString());
        return {
            statusCode: 200,
            body: JSON.stringify({
                answer: body.content[0].text
            })
        };
    } catch (error) {
        console.error("Lambda error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
}