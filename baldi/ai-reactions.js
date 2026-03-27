// New file to handle AI-powered reactions
export class AIReactions {
    constructor() {
        this.reactionCache = new Map(); // Cache to prevent repetitive reactions
        this.MAX_CACHE_SIZE = 50; // Limit cache size
        
        // Predefined reactions for more variety
        this.characterReactions = {
            'Paperman': [
                'Paper is my life, and life is paper! :paperman:',
                'Another day of perfect paper preservation! :quarter:',
                'My paper collection is my treasure! :happy:',
                'Organizing documents is an art form! :cool:',
                'Watermarks tell stories, you know! :papererror:',
                'Each sheet is a world of possibilities! :funny:',
                'Carbon paper: the unsung hero of documentation! :quarter:',
                'Japanese washi paper is my passion! :dance:',
                'Archival quality matters more than you think! :angry:',
                'Paper recycling is my mission! :happy:'
            ],
            'Baldi': [
                'Math is everywhere today! :quarter:',
                'Let\'s solve some mind-bending problems! :smallbaldi:',
                'Equations are my playground! :happy:',
                'Who wants a mathematical challenge? :funny:',
                'Geometry rocks my world! :dance:',
                'Probability is my favorite subject! :cool:',
                'Every problem has a solution! :quarter:',
                'Numerical logic is unbeatable! :smallbaldi:',
                'Calculus makes my day exciting! :happy:',
                'Mathematical mysteries await! :funny:'
            ],
            'Principal': [
                'Discipline is the key to success! :lock:',
                'Rules are not suggestions! :angry:',
                'Respect is non-negotiable! :quarter:',
                'Character builds your future! :serious:',
                'Zero tolerance for misbehavior! :mad:',
                'Order in the classroom! :quarter:',
                'Every action has a consequence! :lock:',
                'Civility is our school\'s cornerstone! :serious:',
                'Conduct yourself with honor! :mad:',
                'Education begins with self-control! :angry:'
            ],
            'default': [
                'Something interesting just happened! :funny:',
                'Experiencing a moment of curiosity! :quarter:',
                'What an unexpected turn of events! :happy:',
                'Wow, things are getting interesting! :smallbaldi:',
                'Life is full of surprises! :dance:',
                'This is quite an adventure! :cool:',
                'Who knows what comes next? :quarter:',
                'Embracing the unexpected! :happy:',
                'Another exciting moment! :funny:',
                'Let\'s see where this goes! :smallbaldi:'
            ]
        };
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

            // Get reactions for specific character or use default
            const reactions = this.characterReactions[characterName] || this.characterReactions['default'];
            
            const reaction = reactions[Math.floor(Math.random() * reactions.length)];

            // Update cache
            this.reactionCache.set(characterName, [...reactions]);

            // Manage cache size
            if (this.reactionCache.size > this.MAX_CACHE_SIZE) {
                const oldestKey = this.reactionCache.keys().next().value;
                this.reactionCache.delete(oldestKey);
            }

            return reaction;

        } catch (error) {
            console.error('Error generating random reaction:', error);
            return `Oops, something interesting just happened! :funny:`;
        }
    }

    static async checkVideoContent(frameDataUrl) {
        try {
            const completion = await websim.chat.completions.create({
                model: "gpt-5.1",
                messages: [
                    {
                        role: "system",
                        content: `You are an advanced content moderator in a school environment. 
                        Carefully and comprehensively analyze the video content for:
                        1. Explicit or sexually suggestive content
                        2. Violent or graphically disturbing imagery
                        3. Hate speech or discriminatory content
                        4. Drug or alcohol use
                        5. Extreme or dangerous behaviors
                        6. Bullying or harassment
                        7. Inappropriate language or gestures

                        Your analysis should be strict and prioritize student safety.
                        Respond with a detailed JSON response:
                        {
                            "isInappropriate": boolean,
                            "inappropriateCategories": string[],
                            "confidence": number, // 0-1 confidence in determination
                            "detentionRequired": boolean,
                            "detentionMessage": string|null,
                            "severityLevel": "low"|"medium"|"high"
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

            // Adjust detention requirements based on severity
            result.detentionRequired = result.isInappropriate && result.confidence > 0.6;

            // Generate specific detention messages
            if (result.detentionRequired) {
                const severityMessages = {
                    "low": `Mild inappropriate content detected in the ${result.inappropriateCategories.join(', ')} category.`,
                    "medium": `Inappropriate content detected in the ${result.inappropriateCategories.join(', ')} category. Reporting to the Principal's office.`,
                    "high": `SERIOUS VIOLATION of school content guidelines in the ${result.inappropriateCategories.join(', ')} category. Immediate detention required.`
                };
                
                result.detentionMessage = severityMessages[result.severityLevel] || 
                    "Inappropriate content detected. Reporting to the Principal's office.";
            }

            return result;

        } catch (error) {
            console.error('Error checking video content:', error);
            return {
                isInappropriate: false,
                inappropriateCategories: [],
                confidence: 0,
                detentionRequired: false,
                detentionMessage: null,
                severityLevel: "low"
            };
        }
    }

    static async generateVideoReaction(frameDataUrl) {
        try {
            const completion = await websim.chat.completions.create({
                model: "gpt-5.1",
                messages: [
                    {
                        role: "system",
                        content: `You are Baldi watching a video. Provide an extremely short reaction that:
                        - Must be 10 words or less
                        - Must include exactly one emoji
                        - Be fun and engaging
                        - Focus on one key aspect
                        
                        Respond with JSON:
                        {
                            "message": "Your ultra-short reaction (max 10 words) with ONE emoji",
                            "emotion": "happy|shocked|excited|confused|amused|neutral|angry|sad|distorted|error|blind|old|glitch"
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

            return result;

        } catch (error) {
            console.error('Error generating video reaction:', error);
            return {
                message: `Oops, something interesting just happened! :funny:`,
                emotion: "neutral"
            };
        }
    }
}

// Create a singleton instance for efficient caching
export const aiReactions = new AIReactions();