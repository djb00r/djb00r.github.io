import { characterPersonalities } from './character-personalities.js';

export class RandomChatGenerator {
    constructor(chatUI) {
        this.chatUI = chatUI;
        this.chatInterval = null;
        this.charactersToExclude = [
            'User', 'Baldi', 'Principal', 'System', 'Bully'
        ];
    }

    startRandomChatter() {
        // Clear any existing interval
        this.stopRandomChatter();

        // Start new interval
        this.chatInterval = setInterval(() => {
            this.triggerRandomCharacterMessage();
        }, 2000); // Every 2 seconds
    }

    stopRandomChatter() {
        if (this.chatInterval) {
            clearInterval(this.chatInterval);
            this.chatInterval = null;
        }
    }

    triggerRandomCharacterMessage() {
        if (!this.chatUI || !this.chatUI.activeChatters) return;

        const chatters = Array.from(this.chatUI.activeChatters.keys())
            .filter(name => !this.charactersToExclude.includes(name));

        if (chatters.length === 0) return;

        const randomChatter = chatters[Math.floor(Math.random() * chatters.length)];
        const personalities = characterPersonalities[randomChatter] || characterPersonalities.default;
        const randomMessage = personalities[Math.floor(Math.random() * personalities.length)];

        this.chatUI.addMessage(randomChatter, randomMessage);
    }
}