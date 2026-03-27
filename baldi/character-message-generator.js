import { characterPersonalities } from './character-personalities.js';
import { predefinedResponses } from './predefined-responses.js';
import { AIReactions } from './ai-reactions.js';

export class CharacterMessageGenerator {
    constructor(chatUI) {
        this.chatUI = chatUI;
        this.messageInterval = null;
        this.reactionInterval = null;
    }

    startRandomCharacterMessages() {
        // Ensure cleanup of any existing interval
        this.stopRandomCharacterMessages();

        // Validate chatUI
        if (!this.chatUI || !this.chatUI.activeChatters) {
            console.warn('ChatUI or activeChatters is not initialized');
            return;
        }

        // Start character messages every 3 seconds
        this.messageInterval = setInterval(() => {
            this.sendRandomCharacterMessage();
        }, 3000);

        // Start AI reactions every 6 seconds
        this.reactionInterval = setInterval(() => {
            this.triggerAIMessageReaction();
        }, 6000);
    }

    stopRandomCharacterMessages() {
        if (this.messageInterval) {
            clearInterval(this.messageInterval);
            this.messageInterval = null;
        }
        if (this.reactionInterval) {
            clearInterval(this.reactionInterval);
            this.reactionInterval = null;
        }
    }

    sendRandomCharacterMessage() {
        // Validate chatUI
        if (!this.chatUI || !this.chatUI.activeChatters) {
            console.warn('ChatUI or activeChatters is not initialized');
            return;
        }

        // Get valid chatters
        const chatters = Array.from(this.chatUI.activeChatters.keys())
            .filter(name => 
                name !== 'User' && 
                name !== 'Baldi' && 
                name !== 'Principal' && 
                name !== 'Bully' && 
                name !== 'System'
            );

        // If no chatters, exit
        if (chatters.length === 0) return;

        // Select a random chatter
        const randomChatter = chatters[Math.floor(Math.random() * chatters.length)];

        // Get predefined response
        const response = predefinedResponses.getPredefinedResponse(randomChatter);

        // Add the message
        if (this.chatUI && typeof this.chatUI.addMessage === 'function') {
            this.chatUI.addMessage(randomChatter, response);
        }
    }

    async triggerAIMessageReaction() {
        // Validate chatUI
        if (!this.chatUI || !this.chatUI.activeChatters) {
            console.warn('ChatUI or activeChatters is not initialized');
            return;
        }

        // Get valid chatters
        const chatters = Array.from(this.chatUI.activeChatters.keys())
            .filter(name => 
                name !== 'User' && 
                name !== 'Baldi' && 
                name !== 'Principal' && 
                name !== 'Bully' && 
                name !== 'System'
            );

        // If no chatters, exit
        if (chatters.length === 0) return;

        // Select a random chatter
        const randomChatter = chatters[Math.floor(Math.random() * chatters.length)];

        try {
            // Generate AI reaction
            const completion = await websim.chat.completions.create({
                model: "gpt-5.1",
            });
            const reaction = completion.choices[0].message.content;

            // Add the reaction
            if (this.chatUI && typeof this.chatUI.addMessage === 'function') {
                this.chatUI.addMessage(randomChatter, reaction);
            }
        } catch (error) {
            console.error('Error in AI message reaction:', error);
        }
    }
}