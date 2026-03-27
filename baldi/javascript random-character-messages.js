import { characterPersonalities } from './character-personalities.js';
import { CharacterInteractions } from './character-interactions.js';
import { config } from './config.js';

export class RandomCharacterMessages {
    constructor(chatUI) {
        this.chatUI = chatUI;
        this.chatInterval = null;
        this.charactersToExclude = [
            'User', 'Baldi', 'Principal', 'System', 'Bully'
        ];
    }

    startRandomChatter() {
        // Stop any existing interval
        this.stopRandomChatter();

        // Start new interval with more robust error handling
        this.chatInterval = setInterval(() => {
            try {
                this.triggerRandomCharacterMessage();
            } catch (error) {
                console.error('Error in random chatter:', error);
            }
        }, 1000); // Every 1 second
    }

    stopRandomChatter() {
        if (this.chatInterval) {
            clearInterval(this.chatInterval);
            this.chatInterval = null;
        }
    }

    triggerRandomCharacterMessage() {
        // Defensive checks
        if (!this.chatUI || typeof this.chatUI.addMessage !== 'function') {
            console.warn('ChatUI not properly initialized');
            return;
        }

        // Get all available chatters
        const availableChatters = config.defaultChatters
            .filter(chatter => 
                !this.charactersToExclude.includes(chatter.name)
            );

        if (availableChatters.length === 0) {
            console.warn('No available chatters');
            return;
        }

        // Select a random chatter
        const randomChatter = availableChatters[Math.floor(Math.random() * availableChatters.length)];
        
        // Get personality or default messages
        const personalities = characterPersonalities[randomChatter.name] || 
            CharacterInteractions.getCharacterPersonality(randomChatter.name);
        
        const randomMessage = personalities[Math.floor(Math.random() * personalities.length)];

        // Safely add message
        this.chatUI.addMessage(randomChatter.name, randomMessage);
    }
}