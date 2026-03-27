import { config } from './config.js';

export class AIReactions {
    constructor() {
        this.reactionCache = new Map(); // Cache to prevent repetitive reactions
        this.MAX_CACHE_SIZE = 50; // Limit cache size
    }

    async getRandomReaction(characterName) {
        try {
            // Check cache first to avoid repetition
            if (this.reactionCache.has(characterName)) {
                const cachedReactions = this.reactionCache.get(characterName);
                if (cachedReactions.length > 0) {
                    return cachedReactions.pop();
                }
            }

            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are ${characterName}, a unique character in the Here School chat. 
                        Generate a spontaneous, quirky reaction or thought. 
                        Use emojis liberally and keep the tone fun and character-specific.
                        Provide 3-5 unique reactions to prevent repetition.
                        Respond with JSON:
                        {
                            "reactions": [
                                "Spontaneous reaction with emojis",
                                "Another unique reaction",
                                // ... more reactions
                            ]
                        }`
                    }
                ],
                json: true
            });

            const reactions = completion.content.reactions || [
                `Just another day in the Here School! :happy:`,
                `Something interesting just happened! :funny:`,
                `Hanging out and having fun! :smallbaldi:`
            ];

            // Update cache
            this.reactionCache.set(characterName, reactions);

            // Manage cache size
            if (this.reactionCache.size > this.MAX_CACHE_SIZE) {
                const oldestKey = this.reactionCache.keys().next().value;
                this.reactionCache.delete(oldestKey);
            }

            return reactions[0];

        } catch (error) {
            console.error('Error generating random reaction:', error);
            return `Oops, something interesting just happened! :funny:`;
        }
    }

    static async getVideoReaction(frameDataUrl) {
        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are Baldi watching a video. Provide a dynamic, engaging reaction that captures the essence of what's happening in the video.
                        Focus on the content, emotions, interesting elements, and your personal response.
                        Do NOT mention technical aspects like frames or image analysis.
                        Include fun, descriptive reactions with appropriate emojis.
                        Respond with JSON:
                        {
                            "message": "Your natural, descriptive reaction with emojis",
                            "emotion": "happy|shocked|excited|confused|amused|neutral|angry|sad"
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
            console.error('Error getting video reaction:', error);
            return {
                message: "Oh wow, this is fascinating! :quarter:", 
                emotion: "excited"
            };
        }
    }

    static async checkVideoContent(frameDataUrl) {
        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are a strict content moderator in a school environment. 
                        Carefully analyze the video content for:
                        - Violence
                        - Explicit or adult content
                        - Hate speech or harmful visualizations
                        - Inappropriate behavior

                        If the content is inappropriate, provide a specific reason and recommend detention.
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

            const result = JSON.parse(completion.content);

            // If detention is required, generate a specific detention message
            if (result.detentionRequired) {
                result.detentionMessage = result.reason || "Inappropriate content detected. Reporting to the Principal's office.";
            }

            return result;
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

// Create a singleton instance for efficient caching
export const aiReactions = new AIReactions();