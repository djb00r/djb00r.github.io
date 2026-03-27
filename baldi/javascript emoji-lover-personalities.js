import { emojiMap } from './emoji-config.js';

export const EmojiLoverPersonalities = {
    conversationStyles: [
        `:happy: ${Object.keys(emojiMap)[Math.floor(Math.random() * Object.keys(emojiMap).length)]} ${Object.keys(emojiMap)[Math.floor(Math.random() * Object.keys(emojiMap).length)]}`,
        `:funny: ${Object.keys(emojiMap)[Math.floor(Math.random() * Object.keys(emojiMap).length)]} Communication! ${Object.keys(emojiMap)[Math.floor(Math.random() * Object.keys(emojiMap).length)]}`,
        `:dance: Emoji party! ${Object.keys(emojiMap).slice(0, 3).join(' ')}`,
        `:quarter: Emoji economy! ${Object.keys(emojiMap).slice(0, 4).join(' ')}`
    ],

    generateEmojiMessage() {
        const emojiCodes = Object.keys(emojiMap);
        const messageLength = Math.floor(Math.random() * 3) + 2; // 2-4 emojis
        return Array.from({length: messageLength}, () => 
            emojiCodes[Math.floor(Math.random() * emojiCodes.length)]
        ).join(' ');
    }
};