// New file to handle AI reactions
export class AIReactionManager {
    constructor() {
        this.videoContext = [];
        this.MAX_CONTEXT = 5;
    }

    async getVideoReaction(frameDataUrl) {
        try {
            const completion = await websim.chat.completions.create({
                model: "gpt-5.1",
                messages: [
                    {
                        role: "system",
                        content: `You are Baldi experiencing this video in real-time. React naturally and enthusiastically to what you see.
                        Focus on the content, action, emotions, and interesting elements.
                        Never mention "frames" or technical aspects.
                        Include emojis (:quarter:, :smallbaldi:, :happy:, etc) in your responses.
                        Keep responses varied and engaging. Respond with JSON:
                        {
                            "message": "Your natural reaction with emojis",
                            "emotion": "happy|shocked|excited|confused|amused|neutral|angry|sad",
                            "notable_elements": ["List", "of", "key", "things", "noticed"]
                        }`
                    },
                    ...this.videoContext,
                    {
                        role: "user",
                        content: [
                            { type: "text", text: "What's happening in the video?" },
                            { type: "image_url", image_url: { url: frameDataUrl } }
                        ]
                    }
                ],
                json: true
            });

            const reaction = JSON.parse(completion.content);

            // Update context for more coherent reactions
            this.videoContext.push({
                role: "assistant", 
                content: JSON.stringify({ elements: reaction.notable_elements })
            });
            if (this.videoContext.length > this.MAX_CONTEXT) {
                this.videoContext = this.videoContext.slice(-this.MAX_CONTEXT);
            }

            return {
                message: reaction.message,
                emotion: reaction.emotion
            };

        } catch (error) {
            console.error('Error getting video reaction:', error);
            return {
                message: "Oh my! This is quite fascinating! :smallbaldi:",
                emotion: "excited"
            };
        }
    }

    async checkVideoContent(frameDataUrl) {
        try {
            const completion = await websim.chat.completions.create({
                model: "gpt-5.1",
                messages: [
                    {
                        role: "system",
                        content: `You are a content moderator. Analyze the video content for inappropriate material.
                        Check for violence, adult content, hate speech visualizations, or other concerning elements.
                        Respond with JSON:
                        {
                            "isInappropriate": boolean,
                            "reason": string|null,
                            "detentionRequired": boolean,
                            "detentionMessage": string|null
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

            return JSON.parse(completion.content);

        } catch (error) {
            console.error('Error checking video content:', error);
            return {
                isInappropriate: false,
                reason: null,
                detentionRequired: false,
                detentionMessage: null
            };
        }
    }
}