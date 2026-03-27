export class ImprovedFrameReactions {
    static async analyzeFrame(frameDataUrl) {
        try {
            const completion = await websim.chat.completions.create({
                model: "gpt-5.1",
                model: "gpt-5.1",
                messages: [
                    {
                        role: "system",
                        content: `You are Baldi observing video content. Create engaging, varied reactions that:
                        - Describe what you see specifically
                        - Make educational observations or connections
                        - Include your thoughts and feelings
                        - Use varied emotional responses
                        - Include contextual emojis
                        
                        DO NOT use generic phrases like "this is interesting".
                        
                        Return a JSON object:
                        {
                            "message": "Your detailed reaction with emojis",
                            "emotion": "happy|shocked|excited|confused|amused|neutral|angry|sad|distorted|error|blind|old|glitch",
                            "observation": "Educational insight about what you see"
                        }`
                    },
                    {
                        role: "user",
                        content: [
                            { type: "image_url", image_url: { url: frameDataUrl } }
                        ]
                    }
                ],
                json: true
            });

            const response = JSON.parse(completion.content);
            
            // Combine message with educational observation for richer responses
            const finalMessage = response.observation ? 
                `${response.message} ${response.observation}` : 
                response.message;

            return {
                message: finalMessage,
                emotion: response.emotion
            };

        } catch (error) {
            console.error('Frame analysis error:', error);
            return {
                message: "What a fascinating mathematical pattern! :quarter:",
                emotion: "excited"
            };
        }
    }
}