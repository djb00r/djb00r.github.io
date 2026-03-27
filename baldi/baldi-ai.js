import { emojiMap } from './emoji-config.js';

export class BaldiAI {
    constructor() {
        this.conversationHistory = [];
        this.defaultPersonality = `You are Baldi, an enthusiastic math teacher. Keep responses:
        - Under 10 words
        - Include ONE emoji only
        - Focus on one key observation or reaction
        - Stay quirky but extremely brief`;
    }

    async generateResponse(prompt, context = {}) {
        try {
            const completion = await websim.chat.completions.create({
                model: "gpt-5.1",
                messages: [
                    {
                        role: "system",
                        content: this.defaultPersonality
                    },
                    ...this.conversationHistory,
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 150
            });

            // Clean and process the response
            const processedResponse = this.processResponse(completion.content);

            // Update conversation history
            this.updateConversationHistory(prompt, processedResponse);

            return processedResponse;
        } catch (error) {
            console.error('Baldi AI Error:', error);
            return this.getFallbackResponse();
        }
    }

    processResponse(response) {
        // Ensure emojis are included
        const emojiCodes = Object.keys(emojiMap);
        const randomEmoji = emojiCodes[Math.floor(Math.random() * emojiCodes.length)];
        
        // Add emoji if not present
        if (!response.includes(':')) {
            response += ` ${randomEmoji}`;
        }

        return response;
    }

    updateConversationHistory(userPrompt, aiResponse) {
        // Add to conversation history
        this.conversationHistory.push(
            { role: "user", content: userPrompt },
            { role: "assistant", content: aiResponse }
        );

        // Trim history to last 5 interactions
        if (this.conversationHistory.length > 10) {
            this.conversationHistory = this.conversationHistory.slice(-10);
        }
    }

    getFallbackResponse() {
        const fallbackResponses = [
            "Oops! My calculator seems to be malfunctioning. :smallbaldi:",
            "Math can be tricky sometimes! :quarter:",
            "I'm thinking... processing! :happy:",
            "Hmm, that's an interesting problem! :smallbaldi:"
        ];

        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }

    async analyzeContent(content, type = 'text') {
        try {
            const messages = [
                {
                    role: "system",
                    content: `You are Baldi, analyzing ${type} content. 
                    Provide an educational, math-related, or insightful observation.
                    Include a fun emoji and keep it concise.`
                }
            ];

            if (type === 'image') {
                messages.push({
                    role: "user",
                    content: [
                        { type: "text", text: "Describe and analyze this image:" },
                        { type: "image_url", image_url: { url: content } }
                    ]
                });
            } else {
                messages.push({
                    role: "user",
                    content: content
                });
            }

            const completion = await websim.chat.completions.create({
                model: "gpt-5.1",
                messages: messages,
                max_tokens: 100
            });

            return this.processResponse(completion.content);
        } catch (error) {
            console.error('Content Analysis Error:', error);
            return this.getFallbackResponse();
        }
    }
    
    async analyzeChatContext(messages) {
        try {
            const completion = await websim.chat.completions.create({
                model: "gpt-5.1",
                messages: [
                    {
                        role: "system",
                        content: `You are Baldi observing a chat. Provide a VERY brief, math-related or educational comment.
                        Must be under 10 words and include ONE emoji.
                        Focus on being brief, educational, and slightly quirky.`
                    },
                    {
                        role: "user",
                        content: `Here are the recent messages:
                        ${messages.map(msg => `${msg.sender}: ${msg.content}`).join('\n')}`
                    }
                ],
                max_tokens: 50
            });
            
            return this.processResponse(completion.content);
        } catch (error) {
            console.error('Chat analysis error:', error);
            return null;
        }
    }
}

// Create and export singleton instance
export const baldiAI = new BaldiAI();