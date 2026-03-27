export class AdvancedConversationManager {
    constructor(chatUI) {
        this.chatUI = chatUI;
        this.CONVERSATION_PROBABILITY = 0.4;
        this.MAX_CONVERSATION_LENGTH = 6;
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
        const otherChatter = availableChatters.filter(name => name !== conversationStarter)
            [Math.floor(Math.random() * (availableChatters.length - 1))];

        try {
            const conversation = await this.generateAIConversation(conversationStarter, otherChatter);
            this.displayConversation(conversation);
        } catch (error) {
            console.error('Conversation generation error:', error);
        }
    }

    async generateAIConversation(starter, otherChatter) {
        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `Generate a natural, engaging conversation between ${starter} and ${otherChatter}. 
                        Create 4-6 messages that flow logically and show personality. 
                        Use emojis to make it fun and engaging. 
                        Respond with a JSON array of messages with sender and content.`
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
                        senderSpan.textContent = '🗯️ Conversation between ' + 
                            conversation[0].sender + ' and ' + 
                            conversation[conversation.length - 1].sender;
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