import { config } from './config.js';

export class ChatResponseManager {
    constructor(chatUI, aiAssistant) {
        this.chatUI = chatUI;
        this.aiAssistant = aiAssistant;
        this.RESPONSE_INTERVAL = 10000; // 10 seconds
        this.responseInterval = null;
    }

    startPeriodicResponses() {
        this.stopPeriodicResponses();
        
        this.responseInterval = setInterval(async () => {
            try {
                // Get the last few messages from chat history
                const messages = this.getRecentMessages();
                
                if (messages.length > 0) {
                    const conversationContext = messages.map(msg => ({
                        role: msg.sender === 'User' ? 'user' : 'assistant',
                        content: msg.text
                    }));

                    const baldiResponse = await this.generateBaldiResponse(conversationContext);
                    
                    // Add Baldi's response to the chat
                    this.chatUI.addMessage('Baldi', baldiResponse);
                }
            } catch (error) {
                console.error('Error in periodic chat response:', error);
            }
        }, this.RESPONSE_INTERVAL);
    }

    stopPeriodicResponses() {
        if (this.responseInterval) {
            clearInterval(this.responseInterval);
            this.responseInterval = null;
        }
    }

    getRecentMessages(limit = 5) {
        // This method assumes chatUI has a way to access recent messages
        // You might need to modify ChatUI to expose this functionality
        const messagesContainer = this.chatUI.messagesContainer;
        const messageElements = messagesContainer.querySelectorAll('.chat-message');
        
        const recentMessages = [];
        
        // Iterate from the end to get the most recent messages
        for (let i = messageElements.length - 1; i >= 0 && recentMessages.length < limit; i--) {
            const headerElement = messageElements[i].querySelector('.message-header');
            const contentElement = messageElements[i].querySelector('.message-content');
            
            if (headerElement && contentElement) {
                recentMessages.unshift({
                    sender: headerElement.textContent,
                    text: contentElement.textContent
                });
            }
        }

        return recentMessages;
    }

    async generateBaldiResponse(conversationContext) {
        try {
            const completion = await websim.chat.completions.create({
                model: "gpt-5.1",
                messages: [
                    {
                        role: "system",
                        content: `You are Baldi, a quirky math teacher in the Here School Chat. 
                        Analyze the recent conversation and provide a witty, math-related response. 
                        Always include an emoji and keep the response fun and educational!
                        Your response should connect to the conversation in a clever way.`
                    },
                    ...conversationContext
                ],
                max_tokens: 100
            });

            // Process potential emoji inclusion
            const processedResponse = this.processEmojis(completion.content);

            return processedResponse;
        } catch (error) {
            console.error('Error generating Baldi response:', error);
            return "Looks like we need to do some mathematical problem-solving! :quarter:";
        }
    }

    processEmojis(text) {
        const emojis = [
            ":quarter:", ":smallbaldi:", ":happy:", ":funny:", ":cool:"
        ];
        
        // Randomly add an emoji if not present
        if (!text.includes(':')) {
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            return `${text} ${randomEmoji}`;
        }
        
        return text;
    }
}