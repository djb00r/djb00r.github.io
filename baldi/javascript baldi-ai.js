import { emojiMap } from './emoji-config.js';

export class BaldiAI {
    constructor(chatUI) {
        this.chatUI = chatUI;
        this.conversationHistory = [];
        this.defaultPersonality = `You are Baldi, an enthusiastic math teacher. Keep responses:
        - Under 15 words
        - Include ONE emoji only
        - Focus on one key observation or reaction
        - Stay quirky but brief`;
    }

    async generateResponse(prompt, context = {}) {
        try {
            const completion = await websim.chat.completions.create({
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
                max_tokens: 50
            });

            const processedResponse = this.processResponse(completion.content);
            this.updateConversationHistory(prompt, processedResponse);
            return processedResponse;

        } catch (error) {
            console.error('Baldi AI Error:', error);
            return "Numbers never lie! :quarter:";
        }
    }

    processResponse(response) {
        const emojiCodes = Object.keys(emojiMap);
        const randomEmoji = emojiCodes[Math.floor(Math.random() * emojiCodes.length)];

        if (!response.includes(':')) {
            response += ` ${randomEmoji}`;
        }

        return response;
    }

    updateConversationHistory(prompt, response) {
        this.conversationHistory.push({
            role: "assistant",
            content: response
        });
    }

    // Fallback response is used in case of an error
    getFallbackResponse() {
        const fallbackResponses = [
            "Mathematical curiosity sparks from every conversation! :quarter:",
            "Every chat is a lesson waiting to be discovered! :smallbaldi:",
            "Social interactions can be equations of human behavior! :happy:",
            "Communication is a complex algorithm of understanding! :quarter:"
        ];

        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
}

// Singleton export for easier use
export const baldiAI = new BaldiAI();