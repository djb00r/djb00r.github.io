import { ImprovedAIReactions } from './improved-ai-reactions.js';
import { SpeechBubble } from './speech-bubble.js';
import { DetentionManager } from './detention-manager.js';

const speechBubble = new SpeechBubble();
const detentionManager = new DetentionManager();

export async function captureAndAnalyzeFrame(video) {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');

        // Get Baldi's reaction using improved AI
        const reaction = await ImprovedAIReactions.generateVideoReaction(dataUrl);
        speechBubble.show(reaction.message, reaction.emotion);

    } catch (error) {
        console.error('Error during frame analysis:', error);
        speechBubble.show("Let's solve this! :quarter:", "excited");
    }
}

export async function handlePhotoUpload(file) {
    const photoDisplay = document.createElement('img');
    photoDisplay.id = 'photoDisplay';
    photoDisplay.style.maxWidth = '100%';
    photoDisplay.style.maxHeight = '600px';
    document.querySelector('.video-section').appendChild(photoDisplay);

    const reader = new FileReader();
    reader.onload = (e) => {
        photoDisplay.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

export async function analyzePhoto(dataUrl) {
    try {
        const reaction = await ImprovedAIReactions.generateVideoReaction(dataUrl);
        speechBubble.show(reaction.message, reaction.emotion);
    } catch (error) {
        console.error('Error analyzing photo:', error);
        speechBubble.show("Hmm, something interesting here! :quarter:", "excited");
    }
}