import { config } from './config.js';
import { AIReactions } from './ai-reactions.js';

export class ConversationManager {
    constructor(chatUI) {
        this.chatUI = chatUI;
        this.conversations = [];
        this.MAX_CONVERSATIONS = 3;
        this.CONVERSATION_PROBABILITY = 0.3; // 30% chance of starting a conversation
    }

    async startRandomConversation() {
        if (Math.random() > this.CONVERSATION_PROBABILITY) return;

        const availableChatters = Array.from(this.chatUI.activeChatters.keys())
            .filter(name => 
                name !== 'User' && 
                name !== 'Baldi' && 
                name !== 'Principal' && 
                name !== 'System' && 
                name !== 'Bully'
            );

        if (availableChatters.length < 2) return;

        const conversationStarter = availableChatters[Math.floor(Math.random() * availableChatters.length)];
        const otherChatter = availableChatters.filter(name => name !== conversationStarter)[Math.floor(Math.random() * (availableChatters.length - 1))];

        try {
            const conversation = await this.generateConversation(conversationStarter, otherChatter);
            
            // Add conversation to active conversations
            this.conversations.push({
                starter: conversationStarter,
                participants: [conversationStarter, otherChatter],
                messages: conversation,
                ended: false
            });

            // Limit total conversations
            if (this.conversations.length > this.MAX_CONVERSATIONS) {
                this.conversations.shift();
            }

            // Display conversation
            this.displayConversation(conversation);

        } catch (error) {
            console.error('Error starting conversation:', error);
        }
    }

    async generateConversation(starter, otherChatter) {
        try {
            const completion = await websim.chat.completions.create({
                model: "gpt-5.1",
                messages: [
                    {
                        role: "system",
                        content: `Generate a short, casual conversation between ${starter} and ${otherChatter} 
                        in the Here School Chat. Include 3-4 messages total. 
                        Use emojis to make it fun and engaging. 
                        Response should be a JSON array of messages with sender and content.`
                    }
                ],
                json: true
            });

            return completion.content;
        } catch (error) {
            console.error('Conversation generation error:', error);
            return [];
        }
    }

    displayConversation(conversation) {
        conversation.forEach((message, index) => {
            setTimeout(() => {
                this.chatUI.addMessage(message.sender, message.content);
                
                // Mark last message with conversation emoji
                if (index === conversation.length - 1) {
                    const lastMessage = this.chatUI.messagesContainer.lastChild;
                    if (lastMessage) {
                        const senderSpan = document.createElement('span');
                        senderSpan.textContent = '🗯️ Conversation';
                        senderSpan.style.fontSize = '0.7em';
                        senderSpan.style.marginLeft = '5px';
                        senderSpan.style.color = '#888';
                        lastMessage.querySelector('.message-header').appendChild(senderSpan);
                    }
                }
            }, index * 1500);
        });
    }
}