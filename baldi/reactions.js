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

        // Check this frame for inappropriate content and trigger detention if needed
        await detentionManager.startDetention(video, 'video');

        // Log the reaction if logManager exists
        if (window.logManager) {
            window.logManager.addLog(window.logManager.logTypes.BALDI_REACTION, reaction.message, {
                emotion: reaction.emotion,
                source: video.id === 'screenShareVideo' ? 'screen-share' : 'video'
            });
        }

    } catch (error) {
        console.error('Error during frame analysis:', error);
        speechBubble.show("Let's solve this! :quarter:", "excited");
        
        // Log the error if logManager exists
        if (window.logManager) {
            window.logManager.addLog(window.logManager.logTypes.BALDI_REACTION, "Error analyzing video frame: Let's solve this! :quarter:", {
                error: error.message,
                source: video.id === 'screenShareVideo' ? 'screen-share' : 'video'
            });
        }
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
        
        // Log the photo upload if logManager exists
        if (window.logManager) {
            window.logManager.addLog(window.logManager.logTypes.FILE_SELECTION, `Uploaded photo: ${file.name}`, {
                fileType: file.type,
                fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
            });
        }
    };
    reader.readAsDataURL(file);
}

export async function analyzePhoto(dataUrl) {
    try {
        const reaction = await ImprovedAIReactions.generateVideoReaction(dataUrl);
        speechBubble.show(reaction.message, reaction.emotion);

        // Check the current photo for inappropriate content and trigger detention if needed
        const photoElement = document.getElementById('photoDisplay');
        if (photoElement) {
            await detentionManager.startDetention(photoElement, 'photo');
        }
        
        // Log the photo reaction if logManager exists
        if (window.logManager) {
            window.logManager.addLog(window.logManager.logTypes.BALDI_REACTION, reaction.message, {
                emotion: reaction.emotion,
                source: 'photo'
            });
        }
    } catch (error) {
        console.error('Error analyzing photo:', error);
        speechBubble.show("Hmm, something interesting here! :quarter:", "excited");
        
        // Log the error if logManager exists
        if (window.logManager) {
            window.logManager.addLog(window.logManager.logTypes.BALDI_REACTION, "Error analyzing photo: Hmm, something interesting here! :quarter:", {
                error: error.message,
                source: 'photo'
            });
        }
    }
}