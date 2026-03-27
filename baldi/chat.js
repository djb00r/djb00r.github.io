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
import { initializeChatWithWelcome } from './chat-initialization.js';

export class ChatUI {
    constructor() {
        // CRITICAL: Initialize activeChatters as an instance property
        this.activeChatters = new Map();

        this.createChatUI();
        this.characterMessageManager = new CharacterMessageManager();
        this.initializeChatters();
        this.updateChatterCount();
        
        // Add emoji list popup
        this.emojiListPopup = new EmojiListPopup(this.chatContainer);

        // Initialize character message generator
        this.characterMessageGenerator = new CharacterMessageGenerator(this);
        
        // Start generating random character messages
        this.characterMessageGenerator.startRandomCharacterMessages();

        // Initialize multiplayer chat
        this.multiplayerChat = new MultiplayerChat(this);

        // Ensure random character messages start
        this.randomCharacterMessages = new RandomCharacterMessages(this);
        this.randomCharacterMessages.startRandomChatter();

        // Initialize with a welcome message
        initializeChatWithWelcome(this);
    }

    initializeChatters() {
        config.defaultChatters.forEach(chatter => {
            this.addChatter(chatter.name, chatter.personality, chatter.color);
        });

        this.addRandomChatters(3);
    }

    addRandomChatters(count) {
        for (let i = 0; i < count; i++) {
            const name = config.randomNames[Math.floor(Math.random() * config.randomNames.length)];
            if (!this.activeChatters.has(name)) {
                this.addChatter(name, "A random student in class", this.getRandomColor());
            }
        }
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
        this.updateChatterCount();
        return true;
    }

    removeChatter(name) {
        if (name !== 'Baldi' && name !== 'User') {
            this.activeChatters.delete(name);
            this.updateChatterCount();
            return true;
        }
        return false;
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
        const count = this.activeChatters.size;
        this.chatterCount.textContent = `${count} ${count === 1 ? 'Chatter' : 'Chatters'}`;
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage(this.input.value));
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage(this.input.value);
        });
        this.ttsToggle.addEventListener('click', () => this.toggleTTS());
        this.addChatterBtn.addEventListener('click', () => this.showAddChatterDialog());
    }

    showAddChatterDialog() {
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
            
            if (this.activeChatters.has(name)) {
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
            colorInput.value = this.getRandomColor();
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
                this.addMessage('System', `${name} has joined the chat!`);
            }
        };

        dialog.querySelector('.remove-btn').onclick = () => {
            const name = dialog.querySelector('#chatterName').value.trim();
            if (name && this.removeChatter(name)) {
                this.addMessage('System', `${name} has left the chat!`);
                dialog.remove();
            } else {
                dialog.querySelector('.validation-message').textContent = 
                    'Cannot remove this chatter or chatter not found';
            }
        };
    }

    getRandomColor() {
        const hue = Math.random() * 360;
        return `hsl(${hue}, 70%, 95%)`;
    }

    async sendMessage(text, sender = 'User') {
        if (!text.trim()) return;

        this.addMessage(sender, text);
        this.input.value = '';

        // Send message via multiplayer
        this.multiplayerChat.sendMessage(text);

        if (sender === 'User') {
            try {
                const completion = await websim.chat.completions.create({
                    model: "gpt-5.1",
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
                        ...this.conversationHistory,
                        {
                            role: "user",
                            content: text
                        }
                    ]
                });

                this.addMessage('Baldi', completion.content);
                this.conversationHistory.push({role: "user", content: text});
                this.conversationHistory.push({role: "assistant", content: completion.content});

                if (this.conversationHistory.length > 10) {
                    this.conversationHistory = this.conversationHistory.slice(-10);
                }

                this.triggerChatterResponses(text);
            } catch (error) {
                console.error('Error getting chat response:', error);
                this.addMessage('System', "Sorry, I'm having trouble responding right now!");
            }
        }
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
                this.addChatter(sender, "A random chatter", this.getRandomColor());
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

    async triggerChatterResponses(userMessage) {
        for (const [name, chatter] of this.activeChatters) {
            if (name !== 'Baldi' && name !== 'User' && 
                Date.now() - chatter.lastMessage > 5000 && 
                Math.random() < chatter.talkingProbability) {
                
                try {
                    const completion = await websim.chat.completions.create({
                        model: "gpt-5.1",
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

                    // Safely parse the response
                    const response = typeof completion === 'string' 
                        ? JSON.parse(completion) 
                        : completion.content;

                    setTimeout(() => {
                        this.addMessage(name, response.response || response);
                        chatter.lastMessage = Date.now();
                    }, Math.random() * 3000);
                } catch (error) {
                    console.error('Error getting chatter response:', error);
                }
            }
        }
    }

    async triggerAIMessageReaction() {
        try {
            // Get a random active chatter (excluding system characters)
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

            // Generate an AI-powered reaction
            const reaction = await AIReactions.getRandomReaction(randomChatter);

            // Add the AI-generated reaction
            this.addMessage(randomChatter, reaction);
        } catch (error) {
            console.error('Error in AI message reaction:', error);
        }
    }

    async triggerRandomMessage(chatterName) {
        const chatter = this.activeChatters.get(chatterName);
        if (!chatter) return;

        if (Date.now() - chatter.lastMessage < 3000) return;

        // Use new message management
        if (!this.characterMessageManager.canSendMessage(chatterName)) {
            return;
        }

        // Get a random message specific to the character
        const characterMessages = CharacterInteractions.getCharacterPersonality(chatterName);
        const randomMessage = characterMessages[Math.floor(Math.random() * characterMessages.length)];

        this.addMessage(chatterName, randomMessage);
        chatter.lastMessage = Date.now();
    }

    async triggerBullyInteraction() {
        const chatters = Array.from(this.activeChatters.keys())
            .filter(name => name !== 'Bully' && name !== 'Principal' && name !== 'User');
        
        if (chatters.length === 0) return;

        const targetChatter = chatters[Math.floor(Math.random() * chatters.length)];
        
        try {
            // Use the dedicated method for bully message
            const bullyMessage = CharacterMessageManager.getBullyMessage(targetChatter);

            // Retrieve predefined bully response for the target
            const targetResponseText = predefinedResponses.getBullyResponse(targetChatter);

            // Bully's message
            this.addMessage('Bully', bullyMessage);

            // Principal's response
            setTimeout(() => {
                this.addMessage('Principal', 'No bullying in the chat.');
                
                // Silence the Bully for 15 seconds
                const bully = this.activeChatters.get('Bully');
                bully.lastMessage = Date.now() + 15000; // 15 seconds silence
                bully.talkingProbability = 0;

                // Restore talking probability after 15 seconds
                setTimeout(() => {
                    bully.talkingProbability = Math.random() * 0.4 + 0.1;
                }, 15000);
            }, 1000);

            // Target's response
            setTimeout(() => {
                this.addMessage(targetChatter, targetResponseText);
            }, 2000);

        } catch (error) {
            console.error('Error in bully interaction:', error);
        }
    }

    setupBullyBehavior() {
        // Add a special Bully character with targeted interactions
        this.addChatter('Bully', 'A troublemaker who targets random chatters', '#ffcccc');

        // Trigger bully interactions every 15 seconds
        setInterval(() => {
            this.triggerBullyInteraction();
        }, 15000);
    }

    toggleTTS() {
        import('./speech.js').then(speech => {
            const isEnabled = speech.toggleTTS();
            this.ttsToggle.textContent = `TTS: ${isEnabled ? 'ON' : 'OFF'}`;
        });
    }

    stopCharacterMessages() {
        this.characterMessageGenerator.stopRandomCharacterMessages();
    }
}