  const { BedrockRuntimeClient, InvokeModelCommand } = await import(
    "@aws-sdk/client-bedrock-runtime"
  );

const model = new BedrockRuntimeClient({
    region: "us-east-2"
})

export async function lambdaHandler(event, context) {
    try {
        const { content } = event
        console.log("Content:", content);
        const response = await model.send(
            new InvokeModelCommand({
                modelId: "amazon.titan-embed-text-v2:0",
                contentType: "application/json",
                accept: "application/json",
                body: JSON.stringify({
                    inputText: content
                })
            })
        )

        const body = JSON.parse(Buffer.from(response.body).toString());
        return {
            statusCode: 200,
            body: JSON.stringify({
                vector: body.embedding
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