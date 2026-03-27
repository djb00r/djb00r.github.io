import { baldiAI } from './baldi-ai.js';

export class ChatAnalyzer {
    constructor(chatUI) {
        this.chatUI = chatUI;
        this.analysisInterval = null;
        this.ANALYSIS_INTERVAL = 15000; // 15 seconds
        this.REACTION_INTERVAL = 4000;  // 4 seconds
    }

    startChatAnalysis() {
        this.stopChatAnalysis();

        this.analysisInterval = setInterval(async () => {
            try {
                // Get recent chat messages
                const recentMessages = this.getRecentMessages();

                if (recentMessages.length > 0) {
                    // Enhanced AI analysis with more context and personality
                    const analysis = await baldiAI.analyzeChatContext(recentMessages);
                    
                    // Add Baldi's commentary to chat with more dynamic responses
                    if (analysis) {
                        this.chatUI.addMessage('Baldi', analysis);
                    }
                }
            } catch (error) {
                console.error('Chat Analysis Error:', error);
            }
        }, this.ANALYSIS_INTERVAL);
    }

    stopChatAnalysis() {
        if (this.analysisInterval) {
            clearInterval(this.analysisInterval);
            this.analysisInterval = null;
        }
    }

    getRecentMessages(limit = 10) {
        const messagesContainer = this.chatUI.messagesContainer;
        const messageElements = messagesContainer.querySelectorAll('.chat-message');
        
        const recentMessages = [];
        
        for (let i = messageElements.length - 1; i >= 0 && recentMessages.length < limit; i--) {
            const headerElement = messageElements[i].querySelector('.message-header');
            const contentElement = messageElements[i].querySelector('.message-content');
            
            if (headerElement && contentElement) {
                recentMessages.unshift({
                    sender: headerElement.textContent,
                    content: contentElement.textContent
                });
            }
        }

        return recentMessages;
    }
}