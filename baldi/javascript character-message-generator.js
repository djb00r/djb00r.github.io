import { characterPersonalities } from './character-personalities.js';
import { predefinedResponses } from './predefined-responses.js';
import { AIReactions } from './ai-reactions.js';

export class CharacterMessageGenerator {
    constructor(chatUI) {
        this.chatUI = chatUI;
        this.messageInterval = null;
        this.reactionInterval = null;
        this.MESSAGE_INTERVAL = 3000;   // 3 seconds
        this.REACTION_INTERVAL = 6000;  // 6 seconds
    }

    startRandomCharacterMessages() {
        this.stopRandomCharacterMessages();

        // Generate character messages
        this.messageInterval = setInterval(() => {
            this.sendRandomCharacterMessage();
        }, this.MESSAGE_INTERVAL);

        // Generate AI reactions
        this.reactionInterval = setInterval(() => {
            this.triggerAIMessageReaction();
        }, this.REACTION_INTERVAL);
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

    async sendRandomCharacterMessage() {
        try {
            const chatters = Array.from(this.chatUI.activeChatters.keys())
                .filter(name => 
                    name !== 'User' && 
                    name !== 'Baldi' && 
                    name !== 'Principal' && 
                    name !== 'Bully' && 
                    name !== 'System'
                );

            if (chatters.length === 0) return;

            const randomChatter = chatters[Math.floor(Math.random() * chatters.length)];
            
            // More AI-powered random message generation
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are ${randomChatter}, a unique character in the Here School chat. 
                        Generate a spontaneous, quirky message that reflects your personality. 
                        Use emojis liberally and keep the tone fun and character-specific.`
                    }
                ]
            });

            this.chatUI.addMessage(randomChatter, completion.content);

        } catch (error) {
            console.error('Error generating random character message:', error);
        }
    }

    async triggerAIMessageReaction() {
        try {
            const chatters = Array.from(this.chatUI.activeChatters.keys())
                .filter(name => 
                    name !== 'User' && 
                    name !== 'Baldi' && 
                    name !== 'Principal' && 
                    name !== 'Bully' && 
                    name !== 'System'
                );

            if (chatters.length === 0) return;

            const randomChatter = chatters[Math.floor(Math.random() * chatters.length)];

            const reaction = await AIReactions.getRandomReaction(randomChatter);
            this.chatUI.addMessage(randomChatter, reaction);

        } catch (error) {
            console.error('Error in AI message reaction:', error);
        }
    }
}