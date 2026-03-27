// New file to handle message display functionality
export class MessageDisplay {
    static processEmojis(text, emojiMap) {
        let processedText = text;
        for (const [code, emoji] of Object.entries(emojiMap)) {
            processedText = processedText.replace(new RegExp(code, 'g'), emoji);
        }
        return processedText;
    }

    static createMessageElement(sender, text, chatterInfo, emojiMap) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message';
        
        const processedText = this.processEmojis(text, emojiMap);

        messageDiv.innerHTML = `
            <div class="message-header">${sender}</div>
            <div class="message-content" style="background-color: ${chatterInfo.color}">${processedText}</div>
        `;
        
        return messageDiv;
    }
}

