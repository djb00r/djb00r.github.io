import { characterPersonalities } from './character-personalities.js';
import { CharacterInteractions } from './character-interactions.js';

export class RandomCharacterMessages {
    constructor(chatUI) {
        this.chatUI = chatUI;
        this.chatInterval = null;
        this.charactersToExclude = [
            'User', 'Baldi', 'Principal', 'System', 'Bully'
        ];
        this.recentCharacters = []; // Track recently active characters
        this.MAX_RECENT_CHARACTERS = 5;
    }

    startRandomChatter() {
        this.stopRandomChatter();
        this.chatInterval = setInterval(() => {
            this.triggerRandomCharacterMessage();
        }, 1000); // Every 1 second
    }

    stopRandomChatter() {
        if (this.chatInterval) {
            clearInterval(this.chatInterval);
            this.chatInterval = null;
        }
    }

    triggerRandomCharacterMessage() {
        if (!this.chatUI || !this.chatUI.activeChatters) return;

        // Get chatters excluding system characters and recently active ones
        const chatters = Array.from(this.chatUI.activeChatters.keys())
            .filter(name => 
                !this.charactersToExclude.includes(name) &&
                !this.recentCharacters.includes(name)
            );

        if (chatters.length === 0) {
            // If no available chatters, reset recent characters
            this.recentCharacters = [];
            return;
        }

        const randomChatter = chatters[Math.floor(Math.random() * chatters.length)];
        
        // Get personality or default messages
        const personalities = characterPersonalities[randomChatter] || 
            CharacterInteractions.getCharacterPersonality(randomChatter);
        
        const randomMessage = personalities[Math.floor(Math.random() * personalities.length)];

        // Add message
        this.chatUI.addMessage(randomChatter, randomMessage);

        // Track recently active characters
        this.recentCharacters.push(randomChatter);
        if (this.recentCharacters.length > this.MAX_RECENT_CHARACTERS) {
            this.recentCharacters.shift();
        }
    }
}