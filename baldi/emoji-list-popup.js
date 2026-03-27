import { emojiMap } from './emoji-config.js';

export class EmojiListPopup {
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
        
        const emojiList = Object.entries(emojiMap).map(([code, html]) => ({
            code,
            html,
            description: this.getEmojiDescription(code)
        }));
        
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

    getEmojiDescription(code) {
        const descriptions = {
            ":angry:": "Angry emotion",
            ":quarter:": "Money reference",
            ":happy:": "Happy emotion",
            ":funny:": "Funny moment",
            ":mad:": "Mad emotion",
            ":playtime:": "Playful moment",
            ":apple:": "Food reference",
            ":broom:": "Cleaning reference",
            ":smallbaldi:": "Cute Baldi moment",
            ":paperman:": "Paperman reference",
            ":dance:": "Dancing",
            ":dance2:": "Alternative dance",
            ":cool:": "Cool moment",
            ":oreo:": "Oreo cookie",
            ":baldiflag:": "Baldi flag",
            ":wheelchair:": "Wheelchair symbol",
            ":papererror:": "Broken image error",
            ":lock:": "Lock symbol",
            ":99:": "99 Abandoned character",
            ":badsum:": "Badsum character",
            ":mathflag:": "Math flag",
            ":leftrightdancebaldidance:": "Baldi dancing with headphones",
            ":wave:": "Baldi waving hello",
            ":yctp:": "Yellow characters plus",
            ":greenplus:": "Green plus symbol",
            ":grayplus:": "Gray plus symbol",
            ":yellowplus:": "Yellow plus symbol",
            ":rules:": "Game rules symbol",
            ":baldi:": "Baldi emoji",
            ":baldidressdance:": "Baldi dancing happily in a dress",
            ":baldistickman:": "Baldi dancing as a stick figure",
            ":baldiheadrocket:": "Baldi's head launching or removing",
            ":nopass:": "Baldi saying no or blocking passage",
            ":bsoda:": "Baldi's branded soda drink",
        };
        return descriptions[code] || "Custom emoji";
    }
}