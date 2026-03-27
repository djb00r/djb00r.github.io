import { config } from './config.js';

export function initializeChatWithWelcome(chatUI) {
    // Ultra-defensive initialization
    try {
        // Verify chatUI exists and has required method
        if (!chatUI || typeof chatUI.addMessage !== 'function') {
            console.error('ChatUI is not properly initialized');
            return;
        }

        // Select a random chatter from the filtered list
        const chatters = config.defaultChatters
            .filter(chatter => 
                !['User', 'Baldi', 'Principal', 'System', 'Bully'].includes(chatter.name)
            );

        if (chatters.length > 0) {
            // Select a truly random chatter
            const randomChatter = chatters[Math.floor(Math.random() * chatters.length)];
            
            // Safely add the initial welcome message with timeout
            setTimeout(() => {
                try {
                    chatUI.addMessage(randomChatter.name, "Hey guys! :happy:");
                } catch (error) {
                    console.error('Error adding initial welcome message:', error);
                }
            }, 500);
        }
    } catch (error) {
        console.error('Initialization error:', error);
    }
}