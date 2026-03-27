import { config } from './config.js';
import { MessageDisplay } from './chat-display.js';
import { emojiMap } from './emoji-config.js';
import { predefinedResponses } from './predefined-responses.js';
import { CharacterInteractions } from './character-interactions.js';
import { CharacterMessageManager } from './character-message-manager.js';
import { EmojiListPopup } from './emoji-list-popup.js';
import { CharacterMessageGenerator } from './character-message-generator.js';
import { MultiplayerChat } from './multiplayer-chat.js';
import { AIReactions } from './ai-reactions.js';
import { RandomCharacterMessages } from './random-character-messages.js';
import { getRandomColor } from './color-utils.js';

let conversationHistory = [];

export class ChatUI {
    static instance;

    constructor() {
        // Safeguard against multiple instantiations
        if (ChatUI.instance) {
            return ChatUI.instance;
        }

        // Initialize core properties with safe defaults
        this.activeChatters = new Map();
        this.messagesContainer = null;
        this.input = null;
        this.sendButton = null;
        this.ttsToggle = null;
        this.addChatterBtn = null;
        this.chatterCount = null;
        this.chatContainer = null;

        // Create a singleton instance
        ChatUI.instance = this;

        // Defer initialization to ensure DOM is ready
        this.initialize();
    }

    static getInstance() {
        if (!ChatUI.instance) {
            ChatUI.instance = new ChatUI();
        }
        return ChatUI.instance;
    }

    async initialize() {
        try {
            // Create UI first
            this.createChatUI();

            // Wait a short moment to ensure DOM is fully loaded
            await new Promise(resolve => setTimeout(resolve, 100));

            // Initialize subsystems
            this.characterMessageManager = new CharacterMessageManager();
            this.initializeChatters();
            this.updateChatterCount();
            
            this.emojiListPopup = new EmojiListPopup(this.chatContainer);
            this.characterMessageGenerator = new CharacterMessageGenerator(this);
            this.multiplayerChat = new MultiplayerChat(this);
            this.randomCharacterMessages = new RandomCharacterMessages(this);

            // Start message generation
            this.characterMessageGenerator.startRandomCharacterMessages();
            this.randomCharacterMessages.startRandomChatter();

            // Welcome message
            this.initializeWithWelcome();

        } catch (error) {
            console.error('Chat initialization error:', error);
        }
    }

    initializeWithWelcome() {
        // Ensure method is called safely
        try {
            const welcomeChatters = config.defaultChatters
                .filter(chatter => 
                    !['User', 'Baldi', 'Principal', 'System', 'Bully']
                    .includes(chatter.name)
                );

            if (welcomeChatters.length > 0) {
                const randomChatter = welcomeChatters[Math.floor(Math.random() * welcomeChatters.length)];
                
                // Ensure chatter is added
                this.addChatter(randomChatter.name, randomChatter.personality, randomChatter.color);
                
                // Safely add the welcome message
                setTimeout(() => {
                    this.addMessage(randomChatter.name, "Hey guys! :happy:");
                }, 500);
            }
        } catch (error) {
            console.error('Welcome message error:', error);
        }
    }

    createChatUI() {
        const chatContainer = document.createElement('div');
        chatContainer.className = 'chat-container';
        chatContainer.innerHTML = `
            <div class="chat-header">
                <div class="chat-header-content">
                    <h3>Here School Chat</h3>
                    <span class="chatter-count">0 Chatters</span>
                </div>
                <button class="add-chatter-btn">Add Chatter</button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input-container">
                <input type="text" class="chat-input" placeholder="Chat with the class...">
                <button class="chat-send">Send</button>
            </div>
            <button class="tts-toggle">TTS: ON</button>
        `;
        document.body.appendChild(chatContainer);

        this.messagesContainer = chatContainer.querySelector('.chat-messages');
        this.input = chatContainer.querySelector('.chat-input');
        this.sendButton = chatContainer.querySelector('.chat-send');
        this.ttsToggle = chatContainer.querySelector('.tts-toggle');
        this.addChatterBtn = chatContainer.querySelector('.add-chatter-btn');
        this.chatterCount = chatContainer.querySelector('.chatter-count');
        this.chatContainer = chatContainer;

        this.setupEventListeners();
    }

    updateChatterCount() {
        if (!this.activeChatters || !this.chatterCount) {
            console.warn('activeChatters or chatterCount not initialized');
            return;
        }
        const count = this.activeChatters.size;
        this.chatterCount.textContent = `${count} ${count === 1 ? 'Chatter' : 'Chatters'}`;
    }

    setupEventListeners() {
        if (!this.sendButton || !this.input || !this.ttsToggle || !this.addChatterBtn) {
            console.warn('Event listener targets not initialized');
            return;
        }
        this.sendButton.addEventListener('click', () => this.sendMessage(this.input.value));
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage(this.input.value);
        });
        this.ttsToggle.addEventListener('click', () => this.toggleTTS());
        this.addChatterBtn.addEventListener('click', () => this.showAddChatterDialog());
    }

    showAddChatterDialog() {
        if (!this.chatContainer) {
            console.warn('chatContainer not initialized');
            return;
        }
        const dialog = document.createElement('div');
        dialog.className = 'chatter-dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <h3>Add New Chatter</h3>
                <div class="input-group">
                    <label for="chatterName">Name:</label>
                    <input type="text" id="chatterName" placeholder="Enter chatter name">
                    <span class="validation-message"></span>
                </div>
                <div class="input-group">
                    <label for="chatterPersonality">Personality:</label>
                    <textarea id="chatterPersonality" placeholder="Describe the chatter's personality..."></textarea>
                </div>
                <div class="input-group">
                    <label for="chatterColor">Message Color:</label>
                    <div class="color-picker-container">
                        <input type="color" id="chatterColor" value="#f0f0f0">
                        <button class="random-color-btn">Random Color</button>
                    </div>
                </div>
                <div class="dialog-preview">
                    <span>Preview:</span>
                    <div class="message-preview">
                        <div class="preview-header">Preview Name</div>
                        <div class="preview-content">This is how messages will look</div>
                    </div>
                </div>
                <div class="dialog-buttons">
                    <button class="cancel-btn">Cancel</button>
                    <button class="add-btn" disabled>Add Chatter</button>
                    <button class="remove-btn" style="background: #ff4444; color: white;">Remove Chatter</button>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);

        const nameInput = dialog.querySelector('#chatterName');
        const personalityInput = dialog.querySelector('#chatterPersonality');
        const colorInput = dialog.querySelector('#chatterColor');
        const addBtn = dialog.querySelector('.add-btn');
        const validation = dialog.querySelector('.validation-message');
        const preview = dialog.querySelector('.message-preview');
        const previewHeader = dialog.querySelector('.preview-header');
        const previewContent = dialog.querySelector('.preview-content');

        const updatePreview = () => {
            previewHeader.textContent = nameInput.value || 'Preview Name';
            preview.style.backgroundColor = colorInput.value;
        };

        const validateInputs = () => {
            const name = nameInput.value.trim();
            const personality = personalityInput.value.trim();
            
            if (!name) {
                validation.textContent = 'Name is required';
                addBtn.disabled = true;
                return false;
            }
            
            if (this.activeChatters && this.activeChatters.has(name)) {
                validation.textContent = 'This name is already taken';
                addBtn.disabled = true;
                return false;
            }
            
            if (!personality) {
                validation.textContent = 'Personality is required';
                addBtn.disabled = true;
                return false;
            }
            
            validation.textContent = '';
            addBtn.disabled = false;
            return true;
        };

        nameInput.addEventListener('input', () => {
            validateInputs();
            updatePreview();
        });
        personalityInput.addEventListener('input', validateInputs);
        colorInput.addEventListener('input', updatePreview);

        dialog.querySelector('.random-color-btn').onclick = () => {
            colorInput.value = getRandomColor();
            updatePreview();
        };

        dialog.querySelector('.cancel-btn').onclick = () => dialog.remove();
        dialog.querySelector('.add-btn').onclick = () => {
            const name = nameInput.value.trim();
            const personality = personalityInput.value.trim();
            const color = colorInput.value;

            if (validateInputs()) {
                this.addChatter(name, personality, color);
                dialog.remove();
                if (this.addMessage) {
                    this.addMessage('System', `${name} has joined the chat!`);
                } else {
                    console.warn('addMessage method not available');
                }
            }
        };

        dialog.querySelector('.remove-btn').onclick = () => {
            const name = dialog.querySelector('#chatterName').value.trim();
            if (name && this.removeChatter(name)) {
                if (this.addMessage) {
                    this.addMessage('System', `${name} has left the chat!`);
                } else {
                    console.warn('addMessage method not available');
                }
                dialog.remove();
            } else {
                dialog.querySelector('.validation-message').textContent = 
                    'Cannot remove this chatter or chatter not found';
            }
        };
    }

    addChatter(name, personality, color) {
        if (!this.activeChatters) {
            console.warn('activeChatters not initialized');
            return false;
        }
        if (this.activeChatters.has(name)) {
            return false;
        }
        this.activeChatters.set(name, {
            personality,
            color,
            lastMessage: Date.now(),
            talkingProbability: Math.random() * 0.4 + 0.1
        });
        this.updateChatterCount();
        return true;
    }

    removeChatter(name) {
        if (!this.activeChatters) {
            console.warn('activeChatters not initialized');
            return false;
        }
        if (name !== 'Baldi' && name !== 'User') {
            this.activeChatters.delete(name);
            this.updateChatterCount();
            return true;
        }
        return false;
    }

    addMessage(sender, text) {
        // Ultra-defensive message adding
        try {
            // Verify core elements exist
            if (!this.messagesContainer) {
                console.warn('Messages container not initialized');
                return;
            }

            // Ensure sender exists in chatters
            if (!this.activeChatters.has(sender)) {
                this.addChatter(sender, "A random chatter", getRandomColor());
            }

            const chatterInfo = this.activeChatters.get(sender) || {
                color: '#e3f2fd',
                personality: 'A user in the chat'
            };
            
            // Create message element safely
            const messageDiv = MessageDisplay.createMessageElement(
                sender, 
                text, 
                chatterInfo, 
                emojiMap
            );
            
            // Use requestAnimationFrame for performance and safety
            requestAnimationFrame(() => {
                try {
                    this.messagesContainer.appendChild(messageDiv);
                    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
                } catch (appendError) {
                    console.error('Error appending message:', appendError);
                }
            });

        } catch (error) {
            console.error('Add message error:', error);
        }
    }

    async sendMessage(text, sender = 'User') {
        if (!text.trim()) return;

        if (!this.addMessage) {
            console.warn('addMessage method not available');
            return;
        }
        this.addMessage(sender, text);
        if (this.input) {
            this.input.value = '';
        }

        this.multiplayerChat.sendMessage(text);

        if (sender === 'User') {
            try {
                const completion = await websim.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: `You are a student in the Here School Chat. Keep responses casual and fun, using these emojis where appropriate:
                            :angry: - for angry reactions
                            :quarter: - for money references
                            :happy: - for happy reactions
                            :funny: - for funny moments
                            :mad: - for mad reactions
                            :playtime: - for playful moments
                            :apple: - for food references
                            :broom: - for cleaning references
                            :smallbaldi: - for cute moments
                            :paperman: - for surprised reactions
                            :dance: - for celebration
                            Try to include at least one emoji in each response!`
                        },
                        ...conversationHistory,
                        {
                            role: "user",
                            content: text
                        }
                    ]
                });

                this.addMessage('Baldi', completion.content);
                conversationHistory.push({role: "user", content: text});
                conversationHistory.push({role: "assistant", content: completion.content});

                if (conversationHistory.length > 10) {
                    conversationHistory = conversationHistory.slice(-10);
                }

                if (this.triggerChatterResponses) {
                    this.triggerChatterResponses(text);
                } else {
                    console.warn('triggerChatterResponses method not available');
                }
            } catch (error) {
                console.error('Error getting chat response:', error);
                this.addMessage('System', "Sorry, I'm having trouble responding right now!");
            }
        }
    }

    async triggerChatterResponses(userMessage) {
        if (!this.activeChatters) {
            console.warn('activeChatters not initialized');
            return;
        }
        for (const [name, chatter] of this.activeChatters) {
            if (name !== 'Baldi' && name !== 'User' && 
                Date.now() - chatter.lastMessage > 5000 && 
                Math.random() < chatter.talkingProbability) {
                
                try {
                    const completion = await websim.chat.completions.create({
                        messages: [
                            {
                                role: "system",
                                content: `You are ${name}. ${chatter.personality}
                                Respond to the user's message in a way that fits your personality.
                                Keep the response short and casual.
                                You must use JSON for your response.`
                            },
                            {
                                role: "user",
                                content: userMessage
                            }
                        ],
                        json: true  // Explicitly request JSON
                    });

                    const response = typeof completion === 'string' 
                        ? JSON.parse(completion) 
                        : completion.content;

                    setTimeout(() => {
                        if (this.addMessage) {
                            this.addMessage(name, response.response || response);
                        } else {
                            console.warn('addMessage method not available');
                        }
                        if (this.activeChatters) {
                            chatter.lastMessage = Date.now();
                        }
                    }, Math.random() * 3000);
                } catch (error) {
                    console.error('Error getting chatter response:', error);
                }
            }
        }
    }

    async triggerAIMessageReaction() {
        if (!this.activeChatters) {
            console.warn('activeChatters not initialized');
            return;
        }
        try {
            const chatters = Array.from(this.activeChatters.keys())
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

            if (this.addMessage) {
                this.addMessage(randomChatter, reaction);
            } else {
                console.warn('addMessage method not available');
            }
        } catch (error) {
            console.error('Error in AI message reaction:', error);
        }
    }

    async triggerRandomMessage(chatterName) {
        if (!this.activeChatters) {
            console.warn('activeChatters not initialized');
            return;
        }
        const chatter = this.activeChatters.get(chatterName);
        if (!chatter) return;

        if (Date.now() - chatter.lastMessage < 3000) return;

        if (!this.characterMessageManager || !this.characterMessageManager.canSendMessage(chatterName)) {
            return;
        }

        const characterMessages = CharacterInteractions.getCharacterPersonality(chatterName);
        const randomMessage = characterMessages[Math.floor(Math.random() * characterMessages.length)];

        if (this.addMessage) {
            this.addMessage(chatterName, randomMessage);
        } else {
            console.warn('addMessage method not available');
        }
        chatter.lastMessage = Date.now();
    }

    async triggerBullyInteraction() {
        if (!this.activeChatters) {
            console.warn('activeChatters not initialized');
            return;
        }
        const chatters = Array.from(this.activeChatters.keys())
            .filter(name => name !== 'Bully' && name !== 'Principal' && name !== 'User');
        
        if (chatters.length === 0) return;

        const targetChatter = chatters[Math.floor(Math.random() * chatters.length)];
        
        try {
            const bullyMessage = CharacterMessageManager.getBullyMessage(targetChatter);

            const targetResponseText = predefinedResponses.getBullyResponse(targetChatter);

            if (this.addMessage) {
                this.addMessage('Bully', bullyMessage);
            } else {
                console.warn('addMessage method not available');
            }

            setTimeout(() => {
                if (this.addMessage) {
                    this.addMessage('Principal', 'No bullying in the chat.');
                } else {
                    console.warn('addMessage method not available');
                }
                
                const bully = this.activeChatters.get('Bully');
                bully.lastMessage = Date.now() + 15000; 
                bully.talkingProbability = 0;

                setTimeout(() => {
                    bully.talkingProbability = Math.random() * 0.4 + 0.1;
                }, 15000);
            }, 1000);

            setTimeout(() => {
                if (this.addMessage) {
                    this.addMessage(targetChatter, targetResponseText);
                } else {
                    console.warn('addMessage method not available');
                }
            }, 2000);

        } catch (error) {
            console.error('Error in bully interaction:', error);
        }
    }

    setupBullyBehavior() {
        if (!this.activeChatters) {
            console.warn('activeChatters not initialized');
            return;
        }
        this.chatterManager.addChatter('Bully', 'A troublemaker who targets random chatters', '#ffcccc');

        setInterval(() => {
            this.triggerBullyInteraction();
        }, 15000);
    }

    toggleTTS() {
        import('./speech.js').then(speech => {
            const isEnabled = speech.toggleTTS();
            if (this.ttsToggle) {
                this.ttsToggle.textContent = `TTS: ${isEnabled ? 'ON' : 'OFF'}`;
            }
        });
    }

    stopCharacterMessages() {
        if (this.characterMessageGenerator) {
            this.characterMessageGenerator.stopRandomCharacterMessages();
        }
    }

    initializeChatters() {
        if (!this.activeChatters) {
            console.warn('activeChatters not initialized');
            return;
        }
        config.defaultChatters.forEach(chatter => {
            this.addChatter(chatter.name, chatter.personality, chatter.color);
        });

        this.addRandomChatters(3);
    }

    addRandomChatters(count) {
        if (!this.activeChatters) {
            console.warn('activeChatters not initialized');
            return;
        }
        for (let i = 0; i < count; i++) {
            const name = config.randomNames[Math.floor(Math.random() * config.randomNames.length)];
            if (!this.activeChatters.has(name)) {
                this.addChatter(name, "A random student in class", getRandomColor());
            }
        }
    }

    function getRandomColor() {
        const hue = Math.random() * 360;
        return `hsl(${hue}, 70%, 95%)`;
    }
}