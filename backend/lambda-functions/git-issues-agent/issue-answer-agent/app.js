const { BedrockRuntimeClient, InvokeModelCommand } = await import(
    "@aws-sdk/client-bedrock-runtime"
  );
  
const model = new BedrockRuntimeClient({
    region: "us-east-2"
})

const systemPrompt = `You are an AI assistant that analyzes GitHub issues and produces a clear technical approach that can guide resolution.  
Your output will later be vectorized and compared with code embeddings, so it must be contextually rich, precise, and directly tied to actionable code-related concepts.  

Guidelines:  
- Begin with a brief restatement of the issue in technical terms.  
- Then, describe in detail how one might approach solving it: debugging steps, relevant code areas, possible architectural considerations, or implementation strategies.  
- Use terminology and phrasing that would naturally align with how the problem connects to source code.  
- The explanation should be detailed enough to meaningfully match similar code vectors, but not overflow into an entire implementation.  
- Do not include filler, apologies, or unrelated commentary.  
- Focus purely on problem understanding and the pathway to a solution.  

Output format:  
Plain text, one well-structured technical explanation of how to approach or solve the issue.`

export async function lambdaHandler(event, context) {
    try {
        const { content } = event
        console.log("Content:", content);

        // Construct the prompt in Llama 3 format
        const fullPrompt = `<|begin_of_text|><|start_header_id|>user<|end_header_id|>

${systemPrompt}

This is the issue: ${content}<|start_header_id|>assistant<|end_header_id|>

`
        
        const response = await model.send(
            new InvokeModelCommand({
                modelId: "us.meta.llama4-maverick-17b-instruct-v1:0",
                contentType: "application/json",
                accept: "application/json",
                body: JSON.stringify({
                    max_gen_len: 1000,
                    temperature: 0.5,
                    top_p: 0.9,
                    prompt: fullPrompt,
                })
            })
        )
        const body = JSON.parse(Buffer.from(response.body).toString());
        console.log("Body:", body);
        
        // Handle the response - the generation should now contain the actual text
        const answer = body.generation || "No answer generated";
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                answer: answer
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