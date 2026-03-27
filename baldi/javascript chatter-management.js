import { config } from './config.js';

export class ChatterManager {
    constructor() {
        this.activeChatters = new Map();
    }

    addChatter(name, personality, color) {
        if (this.activeChatters.has(name)) {
            return false;
        }
        this.activeChatters.set(name, {
            personality,
            color,
            lastMessage: Date.now(),
            talkingProbability: Math.random() * 0.4 + 0.1
        });
        return true;
    }

    removeChatter(name) {
        if (name !== 'Baldi' && name !== 'User') {
            this.activeChatters.delete(name);
            return true;
        }
        return false;
    }

    getRandomColor() {
        const hue = Math.random() * 360;
        return `hsl(${hue}, 70%, 95%)`;
    }

    addRandomChatters(count) {
        const newChatters = [];
        for (let i = 0; i < count; i++) {
            const name = config.randomNames[Math.floor(Math.random() * config.randomNames.length)];
            if (!this.activeChatters.has(name)) {
                const personality = "A random student in class";
                const color = this.getRandomColor();
                this.addChatter(name, personality, color);
                newChatters.push(name);
            }
        }
        return newChatters;
    }
}