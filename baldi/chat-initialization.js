import { config } from './config.js';

export function initializeChatWithWelcome(chatUI) {
    // Ensure chatUI is fully initialized
    if (!chatUI || !chatUI.activeChatters) {
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
        
        // Use setTimeout to ensure everything is set up
        setTimeout(() => {
            try {
                chatUI.addMessage(randomChatter.name, "Hey guys! :happy:");
            } catch (error) {
                console.error('Error adding initial welcome message:', error);
            }
        }, 1000);
    }
}