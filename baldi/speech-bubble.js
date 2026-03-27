import { emojiMap } from './emoji-config.js';

export class SpeechBubble {
    constructor() {
        this.bubble = document.createElement('div');
        this.bubble.className = 'speech-bubble';
        document.querySelector('.baldi-section').appendChild(this.bubble);
        this.baldiImg = document.getElementById('baldiImg');
        this.defaultImage = '/Baldi Reacting Cropped.png';
        this.emotionImages = {
            shocked: '/Screenshot 2025-03-25 115650.png',
            sad: '/Screenshot 2025-03-25 115749.png',
            angry: '/Pngegg_29.webp',
            funny: '/com.funnybaldimod.baldicantstoplaughing-a9061289-892e-4d28-830c-65780d59d990_512x512.webp',
            happy: '/Baldi Reacting Cropped.png',
            excited: '/Baldi Reacting Cropped.png',
            neutral: '/Baldi Reacting Cropped.png',
            scared: '/Screenshot 2025-03-26 172041.png',
            distorted: '/Screenshot 2025-04-20 122038.png',
            error: '/Screenshot 2025-04-20 122038.png',
            blind: '/Screenshot 2025-04-20 122038.png',
            old: '/Screenshot 2025-04-20 122038.png',
            glitch: '/Screenshot 2025-04-20 122038.png',
            detention: '/Screenshot 2025-04-20 122636.png'
        };
    }

    processEmojis(text) {
        let processedText = text;
        for (const [code, emoji] of Object.entries(emojiMap)) {
            processedText = processedText.replace(new RegExp(code, 'g'), emoji);
        }
        return processedText;
    }

    show(text, emotion = 'neutral') {
        // Remove word limit - display full text
        let displayText = text;
        
        // Process emojis in the text
        const processedText = this.processEmojis(displayText);

        // Change Baldi's image based on emotion
        this.baldiImg.src = this.emotionImages[emotion] || this.defaultImage;

        // Create a temporary div to parse the processedText
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = processedText;
        this.bubble.innerHTML = '';
        this.bubble.appendChild(tempDiv);
        
        this.bubble.style.opacity = '1';
        
        // Reset image after speech bubble (increased to 5 seconds)
        setTimeout(() => {
            this.bubble.style.opacity = '0';
            setTimeout(() => {
                this.baldiImg.src = this.defaultImage;
            }, 300);
        }, 5000);
    }
}