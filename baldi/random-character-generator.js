import { characterPersonalities } from './character-personalities.js';
import { CharacterInteractions } from './character-interactions.js';

export class RandomCharacterGenerator {
    constructor(chatUI) {
        this.chatUI = chatUI;
        this.chatInterval = null;
        this.charactersToExclude = [
            'User', 'Baldi', 'Principal', 'System', 'Bully'
        ];
        this.recentCharacters = [];
        this.MAX_RECENT_CHARACTERS = 5;
        this.CHAT_INTERVAL = 1000; // 1 second
    }

    startRandomChatter() {
        this.stopRandomChatter();
        this.chatInterval = setInterval(() => {
            this.triggerRandomCharacterMessage();
        }, this.CHAT_INTERVAL);
    }

    stopRandomChatter() {
        if (this.chatInterval) {
            clearInterval(this.chatInterval);
            this.chatInterval = null;
        }
    }

    triggerRandomCharacterMessage() {
        if (!this.chatUI || !this.chatUI.activeChatters) {
            console.warn('ChatUI or activeChatters is not initialized');
            return;
        }

        // Get all active chatters
        const allChatters = Array.from(this.chatUI.activeChatters.keys())
            .filter(name => 
                !this.charactersToExclude.includes(name)
            );

        if (allChatters.length === 0) {
            console.warn('No available chatters');
            return;
        }

        // Select a random chatter
        const randomChatter = allChatters[Math.floor(Math.random() * allChatters.length)];
        
        // Get personality messages
        const personalities = characterPersonalities[randomChatter] || 
            CharacterInteractions.getCharacterPersonality(randomChatter);
        
        // Select a random message
        const randomMessage = personalities[Math.floor(Math.random() * personalities.length)];

        try {
            // Safely add the message
            if (typeof this.chatUI.addMessage === 'function') {
                this.chatUI.addMessage(randomChatter, randomMessage);
            } else {
                console.warn('addMessage method not found');
            }
        } catch (error) {
            console.error(`Error adding message for ${randomChatter}:`, error);
        }
    }
}