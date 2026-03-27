import { getEmojiList } from './emoji-config.js';

export class EmojiListManager {
    constructor(chatContainer) {
        this.chatContainer = chatContainer;
        this.createEmojiButton();
        this.createEmojiListPopup();
    }

    createEmojiButton() {
        const emojiButton = document.createElement('button');
        emojiButton.textContent = '😀 Emojis';
        emojiButton.className = 'emoji-list-btn';
        emojiButton.addEventListener('click', () => this.toggleEmojiListPopup());
        
        const inputContainer = this.chatContainer.querySelector('.chat-input-container');
        inputContainer.appendChild(emojiButton);
    }

    createEmojiListPopup() {
        const popup = document.createElement('div');
        popup.className = 'emoji-list-popup';
        popup.style.display = 'none';
        
        const emojiList = getEmojiList();
        
        const emojiGrid = document.createElement('div');
        emojiGrid.className = 'emoji-grid';
        
        emojiList.forEach(emoji => {
            const emojiItem = document.createElement('div');
            emojiItem.className = 'emoji-item';
            emojiItem.innerHTML = `
                <div class="emoji-code">${emoji.code}</div>
                <div class="emoji-preview">${emoji.html}</div>
                <div class="emoji-description">${emoji.description}</div>
            `;
            emojiItem.addEventListener('click', () => {
                this.copyEmojiCode(emoji.code);
            });
            emojiGrid.appendChild(emojiItem);
        });
        
        popup.appendChild(emojiGrid);
        this.chatContainer.appendChild(popup);
        this.popup = popup;
    }

    toggleEmojiListPopup() {
        this.popup.style.display = 
            this.popup.style.display === 'none' ? 'block' : 'none';
    }

    copyEmojiCode(code) {
        navigator.clipboard.writeText(code).then(() => {
            const chatInput = this.chatContainer.querySelector('.chat-input');
            chatInput.value += code;
            this.popup.style.display = 'none';
        });
    }
}

