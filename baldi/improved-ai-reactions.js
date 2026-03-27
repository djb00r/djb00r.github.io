import { ImprovedFrameReactions } from './improved-frame-reactions.js';

export class ImprovedAIReactions {
    static async generateVideoReaction(frameDataUrl) {
        try {
            const completion = await websim.chat.completions.create({
                model: "gpt-5.1",
                model: "gpt-5.1",
                messages: [
                    {
                        role: "system",
                        content: `You are Baldi analyzing video content in real-time. Provide ultra-short reactions that:
                        - MUST be 10 words or less
                        - Include exactly ONE emoji
                        - Focus on one key observation
                        - Be fun and snappy
                        - Never exceed 10 words
                        
                        Return JSON with format:
                        {
                            "message": "Your short reaction (max 10 words) with ONE emoji",
                            "emotion": "happy|shocked|excited|confused|amused|neutral|angry|sad|scared|distorted|error|blind|old|glitch"
                        }`
                    },
                    {
                        role: "user",
                        content: [
                            { type: "text", text: "React briefly to this frame:" },
                            { type: "image_url", image_url: { url: frameDataUrl } }
                        ]
                    }
                ],
                json: true,
                max_tokens: 50 // Keep response length limited
            });

            return JSON.parse(completion.content);

        } catch (error) {
            console.error('Error generating video reaction:', error);
            return {
                message: "Wow, that's mathematically interesting! :quarter:",
                emotion: "excited"
            };
        }
    }
}