import { baldiAI } from './baldi-ai.js';

export class ImprovedAIReactions {
    static async generateVideoReaction(frameDataUrl) {
        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are Baldi analyzing video content in real-time. Provide ultra-short reactions that:
                        - MUST be 15 words or less
                        - Include exactly ONE emoji
                        - Focus on one key observation
                        - Be fun and snappy
                        - Never exceed 15 words
                        
                        Return JSON with format:
                        {
                            "reaction": "Your short reaction (max 15 words) with ONE emoji",
                            "emotion": "happy|shocked|excited|confused|amused|neutral|angry|sad"
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

            const response = JSON.parse(completion.content);
            
            // Additional length check
            let message = response.reaction;
            if (message.split(' ').length > 15) {
                // Truncate to 15 words if too long
                message = message.split(' ').slice(0, 15).join(' ');
            }

            return {
                message,
                emotion: response.emotion
            };

        } catch (error) {
            console.error('Error generating video reaction:', error);
            return {
                message: "Wow, that's mathematically interesting! :quarter:",
                emotion: "excited"
            };
        }
    }
}