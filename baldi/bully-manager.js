import { predefinedResponses } from './predefined-responses.js';
import { config } from './config.js';

export class BullyManager {
    constructor(chatUI) {
        this.chatUI = chatUI;
        this.setupBullyBehavior();
    }

    setupBullyBehavior() {
        // Ensure Bully is added to chatters
        if (!this.chatUI.activeChatters.has('Bully')) {
            this.chatUI.addChatter('Bully', 'A troublemaker who targets random chatters', '#ffcccc');
        }

        // Start periodic bully interactions
        this.bullyInterval = setInterval(() => {
            this.triggerBullyInteraction();
        }, config.settings.bullyIntervalSeconds * 1000 || 15000);
    }

    triggerBullyInteraction() {
        const chatters = Array.from(this.chatUI.activeChatters.keys())
            .filter(name => 
                name !== 'Bully' && 
                name !== 'Principal' && 
                name !== 'User'
            );
        
        if (chatters.length === 0) return;

        const targetChatter = chatters[Math.floor(Math.random() * chatters.length)];
        
        const bullyMessage = this.generateBullyMessage(targetChatter);
        const targetResponseText = predefinedResponses.getBullyResponse(targetChatter);

        // Bully's message
        this.chatUI.addMessage('Bully', bullyMessage);

        // Principal's response
        setTimeout(() => {
            this.chatUI.addMessage('Principal', 'No bullying in the chat! :lock:');
        }, 1000);

        // Target's response
        setTimeout(() => {
            this.chatUI.addMessage(targetChatter, targetResponseText);
        }, 2000);
    }

    generateBullyMessage(targetChatter) {
        const bullyPhrases = [
            `Hey ${targetChatter}! Gimme your lunch money! :angry:`,
            `${targetChatter}, you think you're tough? Think again! :mad:`,
            `I'm coming for you, ${targetChatter}! :quarter:`,
            `Watch your back, ${targetChatter}! :funny:`,
            `Time to teach you a lesson, ${targetChatter}! :angry:`
        ];

        return bullyPhrases[Math.floor(Math.random() * bullyPhrases.length)];
    }

    // Method to stop bully interactions if needed
    stopBullyBehavior() {
        if (this.bullyInterval) {
            clearInterval(this.bullyInterval);
        }
    }
}