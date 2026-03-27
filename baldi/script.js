import { ChatUI } from './chat.js';
import { speak } from './speech.js';
import { captureAndAnalyzeFrame, analyzePhoto, handlePhotoUpload } from './reactions.js';
import { DetentionSystem } from './detention.js';
import { DetentionSettings } from './detention-settings.js';
import { emojiMap } from './emoji-config.js';
import { AIAssistant } from './ai-interactions.js';
import { BullyManager } from './bully-manager.js';
import { RandomCharacterMessages } from './random-character-messages.js';
import { initializeChatWithWelcome } from './chat-initialization.js';
import { CharacterListPopup } from './character-list.js';
import { LogManager } from './log-manager.js';

// Initialize systems
const chat = new ChatUI();
const detention = new DetentionSystem(chat);
const detentionSettings = new DetentionSettings();
const aiAssistant = new AIAssistant();
const bullyManager = new BullyManager(chat);
const randomCharacterMessages = new RandomCharacterMessages(chat);
const characterListPopup = new CharacterListPopup();
const logManager = new LogManager(); // Initialize our new log manager
randomCharacterMessages.startRandomChatter();

// Import map for OpenCV.js
const importMap = document.createElement('script');
importMap.type = 'importmap';
importMap.textContent = `{
  "imports": {
    "@techstark/opencv-js": "https://cdn.jsdelivr.net/npm/@techstark/opencv-js@4.7.0-release.1/opencv.js"
  }
}`;
document.head.appendChild(importMap);

let currentVideoUrl = null;
let frameCapture = null;
let photoInterval = null;
let timerInterval = null;
let remainingTime = 0;
let synth = window.speechSynthesis;

// Add log button to assist section
document.getElementById('uploadImageBtn').addEventListener('click', () => {
    document.getElementById('imageUploadForAssist').click();
    logManager.addLog(logManager.logTypes.FILE_SELECTION, 'User clicked "Upload Image" button for assistance', {
        action: 'open file dialog',
        purpose: 'image assistance'
    });
});

// Speech bubble component
class SpeechBubble {
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
        
        // Log Baldi's reaction
        logManager.addLog(logManager.logTypes.BALDI_REACTION, processedText, {
            emotion: emotion
        });
        
        // Reset image after speech bubble (increased to 5 seconds)
        setTimeout(() => {
            this.bubble.style.opacity = '0';
            setTimeout(() => {
                this.baldiImg.src = this.defaultImage;
            }, 300);
        }, 5000);
    }
}

const speechBubble = new SpeechBubble();

document.getElementById('videoInput').addEventListener('change', async function(e) {
    cleanupCurrentMode();
    const file = e.target.files[0];
    const video = document.getElementById('videoPlayer');
    
    if (file) {
        // Log file selection
        logManager.addLog(logManager.logTypes.FILE_SELECTION, `Selected video file: ${file.name}`, {
            fileType: file.type,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            duration: 'Unknown'
        });
        
        if (currentVideoUrl) {
            URL.revokeObjectURL(currentVideoUrl);
        }
        currentVideoUrl = URL.createObjectURL(file);
        video.src = currentVideoUrl;

        // Reset and reinitialize chat
        if (chat && chat.activeChatters) {
            // Clear existing chatters
            chat.activeChatters.clear();
            
            // Reinitialize chatters
            chat.initializeChatters();
            
            // Initialize with welcome message
            initializeChatWithWelcome(chat);
        }

        video.addEventListener('loadeddata', async () => {
            const reaction = "Alright, everyone! Let's watch this video! :happy:";
            speechBubble.show(reaction, "happy");
            
            if (frameCapture) clearInterval(frameCapture);
            frameCapture = setInterval(() => {
                // Ensure the video is not paused before capturing
                if (!video.paused && video.readyState >= 2) {
                    captureAndAnalyzeFrame(video, detention);
                }
            }, 3000);
        }, { once: true });
    }
});

// Mode switching functionality
document.getElementById('videoModeBtn').addEventListener('click', () => {
    cleanupCurrentMode();
    document.getElementById('videoMode').style.display = 'block';
    document.getElementById('photoMode').style.display = 'none';
    document.getElementById('audioMode').style.display = 'none';
    document.getElementById('youtubeMode').style.display = 'none';
    document.getElementById('screenMode').style.display = 'none';
    document.getElementById('videoModeBtn').classList.add('active');
    document.getElementById('photoModeBtn').classList.remove('active');
    document.getElementById('audioModeBtn').classList.remove('active');
    document.getElementById('youtubeModeBtn').classList.remove('active');
    document.getElementById('screenModeBtn').classList.remove('active');
    
    logManager.addLog(logManager.logTypes.BALDI_REACTION, "Switched to Video Mode", {
        mode: "video"
    });
});

document.getElementById('photoModeBtn').addEventListener('click', () => {
    cleanupCurrentMode();
    document.getElementById('videoMode').style.display = 'none';
    document.getElementById('photoMode').style.display = 'block';
    document.getElementById('audioMode').style.display = 'none';
    document.getElementById('youtubeMode').style.display = 'none';
    document.getElementById('screenMode').style.display = 'none';
    document.getElementById('photoModeBtn').classList.add('active');
    document.getElementById('videoModeBtn').classList.remove('active');
    document.getElementById('audioModeBtn').classList.remove('active');
    document.getElementById('youtubeModeBtn').classList.remove('active');
    document.getElementById('screenModeBtn').classList.remove('active');
    
    logManager.addLog(logManager.logTypes.BALDI_REACTION, "Switched to Photo Mode", {
        mode: "photo"
    });
});

document.getElementById('audioModeBtn').addEventListener('click', () => {
    cleanupCurrentMode();
    document.getElementById('videoMode').style.display = 'none';
    document.getElementById('photoMode').style.display = 'none';
    document.getElementById('audioMode').style.display = 'block';
    document.getElementById('youtubeMode').style.display = 'none';
    document.getElementById('screenMode').style.display = 'none';
    document.getElementById('audioModeBtn').classList.add('active');
    document.getElementById('videoModeBtn').classList.remove('active');
    document.getElementById('photoModeBtn').classList.remove('active');
    document.getElementById('youtubeModeBtn').classList.remove('active');
    document.getElementById('screenModeBtn').classList.remove('active');
    
    logManager.addLog(logManager.logTypes.BALDI_REACTION, "Switched to Audio Mode", {
        mode: "audio"
    });
});

// YouTube mode button handler
document.getElementById('youtubeModeBtn').addEventListener('click', () => {
    cleanupCurrentMode();
    document.getElementById('videoMode').style.display = 'none';
    document.getElementById('photoMode').style.display = 'none';
    document.getElementById('audioMode').style.display = 'none';
    document.getElementById('youtubeMode').style.display = 'block';
    document.getElementById('screenMode').style.display = 'none';
    document.getElementById('youtubeModeBtn').classList.add('active');
    document.getElementById('videoModeBtn').classList.remove('active');
    document.getElementById('photoModeBtn').classList.remove('active');
    document.getElementById('audioModeBtn').classList.remove('active');
    document.getElementById('screenModeBtn').classList.remove('active');
    
    logManager.addLog(logManager.logTypes.BALDI_REACTION, "Switched to YouTube Mode", {
        mode: "youtube"
    });
});

// Screen share mode button handler
document.getElementById('screenModeBtn').addEventListener('click', () => {
    cleanupCurrentMode();
    document.getElementById('videoMode').style.display = 'none';
    document.getElementById('photoMode').style.display = 'none';
    document.getElementById('audioMode').style.display = 'none';
    document.getElementById('youtubeMode').style.display = 'none';
    document.getElementById('screenMode').style.display = 'block';
    document.getElementById('screenModeBtn').classList.add('active');
    document.getElementById('videoModeBtn').classList.remove('active');
    document.getElementById('photoModeBtn').classList.remove('active');
    document.getElementById('audioModeBtn').classList.remove('active');
    document.getElementById('youtubeModeBtn').classList.remove('active');
    
    // Hide main video player when in screen share mode
    document.getElementById('videoPlayer').style.display = 'none';
    
    logManager.addLog(logManager.logTypes.SCREEN_SHARE, "Switched to Screen Share Mode", {
        mode: "screen-share"
    });
});

// Photo upload handling
document.getElementById('photoInput').addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (file) {
        cleanupCurrentMode(); 
        
        // Log photo upload
        logManager.addLog(logManager.logTypes.FILE_SELECTION, `Selected photo file: ${file.name}`, {
            fileType: file.type,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        });
        
        await handlePhotoUpload(file);
    }
});

// Start reactions button
document.getElementById('startReactions').addEventListener('click', async () => {
    const photoDisplay = document.getElementById('photoDisplay');
    if (!photoDisplay) {
        speechBubble.show("Please upload a photo first!", null);
        return;
    }

    // Clear any existing intervals
    if (photoInterval) {
        clearInterval(photoInterval);
    }
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    const interval = parseInt(document.getElementById('reactionInterval').value) || 5;
    
    // Log the start of photo reactions
    logManager.addLog(logManager.logTypes.BALDI_REACTION, `Starting timed reactions every ${interval} seconds`, {
        type: "photo",
        interval: `${interval} seconds`
    });
    
    // Create a canvas to get the photo data
    const canvas = document.createElement('canvas');
    canvas.width = photoDisplay.naturalWidth;
    canvas.height = photoDisplay.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(photoDisplay, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');

    // Set up timer
    const timerDisplay = document.getElementById('timerDisplay');
    remainingTime = interval;
    timerDisplay.style.display = 'block';
    
    // Update timer display
    const updateTimer = () => {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    
    updateTimer();

    // Start the countdown
    timerInterval = setInterval(() => {
        remainingTime--;
        updateTimer();
        
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            clearInterval(photoInterval);
            timerDisplay.style.display = 'none';
            photoInterval = null;
            speechBubble.show("Time's up! That was fun!");
            
            logManager.addLog(logManager.logTypes.BALDI_REACTION, "Photo reaction timer complete", {
                type: "photo"
            });
        }
    }, 1000);

    // Start the reaction interval
    photoInterval = setInterval(() => {
        analyzePhoto(dataUrl);
    }, interval * 1000);

    speechBubble.show("I'll start reacting every " + interval + " seconds!");
});

// Stop reactions button
document.getElementById('stopReactions').addEventListener('click', () => {
    if (photoInterval) {
        clearInterval(photoInterval);
        photoInterval = null;
    }
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    document.getElementById('timerDisplay').style.display = 'none';
    speechBubble.show("Okay! I'll stop reacting now!");
    
    logManager.addLog(logManager.logTypes.BALDI_REACTION, "Photo reactions stopped manually", {
        type: "photo",
        action: "manual-stop"
    });
});

// Audio mode functionality
let audioContext;
let analyzer;
let dataArray;
let animationFrame;
let lastReactionTime = 0;

document.getElementById('audioInput').addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (file) {
        // Log audio file selection
        logManager.addLog(logManager.logTypes.FILE_SELECTION, `Selected audio file: ${file.name}`, {
            fileType: file.type,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        });
        
        const audioPlayer = document.getElementById('audioPlayer');
        if (currentVideoUrl) {
            URL.revokeObjectURL(currentVideoUrl);
        }
        currentVideoUrl = URL.createObjectURL(file);
        audioPlayer.src = currentVideoUrl;
        
        // Initialize audio analysis
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyzer = audioContext.createAnalyser();
            analyzer.fftSize = 2048;
            dataArray = new Uint8Array(analyzer.frequencyBinCount);
        }

        const source = audioContext.createMediaElementSource(audioPlayer);
        source.connect(analyzer);
        analyzer.connect(audioContext.destination);

        // Start visualization
        visualizeAudio();

        // Set up periodic audio analysis
        audioPlayer.addEventListener('timeupdate', async () => {
            const currentTime = audioPlayer.currentTime;
            if (currentTime - lastReactionTime >= 5) {
                lastReactionTime = currentTime;
                
                analyzer.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
                
                try {
                    const completion = await websim.chat.completions.create({
                        model: "gpt-5.1",
                        model: "gpt-5.1",
                        messages: [
                            {
                                role: "system",
                                content: `You are Baldi reacting to audio. The current average volume is ${average}/255. 
                                Respond with JSON following this schema: {"reaction": string}`
                            },
                            {
                                role: "user",
                                content: "What's your reaction to this audio segment?"
                            }
                        ],
                        json: true
                    });

                    const response = JSON.parse(completion.content);
                    if (response.reaction) {
                        speechBubble.show(response.reaction);
                        speak(response.reaction);
                    }
                } catch (error) {
                    console.error('Error during audio analysis:', error);
                    speechBubble.show("Oh my! I'm having trouble hearing the audio!", null);
                }
            }
        });
    }
});

function visualizeAudio() {
    const canvas = document.getElementById('audioVisualizer');
    const ctx = canvas.getContext('2d');
    
    function draw() {
        animationFrame = requestAnimationFrame(draw);
        
        const width = canvas.width;
        const height = canvas.height;
        
        analyzer.getByteFrequencyData(dataArray);
        
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, width, height);
        
        const barWidth = (width / dataArray.length) * 2.5;
        let barHeight;
        let x = 0;
        
        for(let i = 0; i < dataArray.length; i++) {
            barHeight = dataArray[i] / 2;
            
            ctx.fillStyle = `hsl(${barHeight + 200}, 100%, 50%)`;
            ctx.fillRect(x, height - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
        }
    }
    
    draw();
}

// Clean up function for switching modes
function cleanupCurrentMode() {
    // Clear any existing intervals
    if (frameCapture) clearInterval(frameCapture);
    if (photoInterval) clearInterval(photoInterval);
    if (timerInterval) clearInterval(timerInterval);
    
    document.getElementById('timerDisplay').style.display = 'none';
    
    // Clear any existing media
    const video = document.getElementById('videoPlayer');
    const photoDisplay = document.getElementById('photoDisplay');
    
    if (photoDisplay) photoDisplay.remove();
    video.style.display = 'block';
    
    if (currentVideoUrl) {
        URL.revokeObjectURL(currentVideoUrl);
        currentVideoUrl = null;
    }
    
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
    if (synth && synth.speaking) {
        synth.cancel();
    }
    
    // Restart random character messages if they've stopped
    if (!randomCharacterMessages.chatInterval) {
        randomCharacterMessages.startRandomChatter();
    }
    
    logManager.addLog(logManager.logTypes.BALDI_REACTION, "Mode cleaned up and reset", {
        action: "cleanup"
    });
}

// Update detention system to show detention image from Screenshot 2025-04-20 122636.png
document.addEventListener('detention-start', () => {
    const baldiImg = document.getElementById('baldiImg');
    baldiImg.src = '/Screenshot 2025-04-20 122636.png';
    
    logManager.addLog(logManager.logTypes.DETENTION, "Detention started", {
        status: "active",
        duration: `${detentionSettings.duration || 15} seconds`
    });
    
    logManager.addLog(logManager.logTypes.PRINCIPAL_MESSAGE, "YOU BROKE THE RULES! DETENTION NOW!", {
        type: "detention-start"
    });
});

// Update detention system to show default image when detention ends
document.addEventListener('detention-end', () => {
    const baldiImg = document.getElementById('baldiImg');
    baldiImg.src = '/Baldi Reacting Cropped.png';
    
    logManager.addLog(logManager.logTypes.DETENTION, "Detention ended", {
        status: "complete"
    });
    
    logManager.addLog(logManager.logTypes.PRINCIPAL_MESSAGE, "You're free to go now. Be good!", {
        type: "detention-end"
    });
});

// Assist section event listener
document.getElementById('assistButton').addEventListener('click', async (event) => {
    const assistInput = document.getElementById('assistInput');
    const inputText = assistInput.value.trim();
    
    if (!inputText) return;

    // Secret "chaos" easter egg: Shift + click Assist Baldi
    if (event.shiftKey && inputText.toLowerCase() === 'chaos') {
        try {
            // Clear the question so it's ignored
            assistInput.value = '';

            // Log the easter egg trigger
            if (window.logManager) {
                window.logManager.addLog(window.logManager.logTypes.BALDI_REACTION,
                    'Chaos easter egg activated! Loading secret video...', {
                        type: 'easter-egg',
                        trigger: 'assist-chaos'
                    }
                );
            }

            // Reset any current mode and timers
            cleanupCurrentMode();

            // Switch UI to Video Mode
            document.getElementById('videoMode').style.display = 'block';
            document.getElementById('photoMode').style.display = 'none';
            document.getElementById('audioMode').style.display = 'none';
            document.getElementById('youtubeMode').style.display = 'none';
            document.getElementById('screenMode').style.display = 'none';
            document.getElementById('videoModeBtn').classList.add('active');
            document.getElementById('photoModeBtn').classList.remove('active');
            document.getElementById('audioModeBtn').classList.remove('active');
            document.getElementById('youtubeModeBtn').classList.remove('active');
            document.getElementById('screenModeBtn').classList.remove('active');

            const video = document.getElementById('videoPlayer');
            video.style.display = 'block';

            // Point directly to the secret chaos video
            const chaosVideoPath = '/019af7eb-f91d-7138-85d3-2b531403125c.mp4';
            video.src = chaosVideoPath;

            // Let Baldi react to THIS video and ignore the question
            speechBubble.show("Chaos time! Let's watch THIS video! :smallbaldi:", "excited");

            video.addEventListener('loadeddata', () => {
                // Clear any previous frame capture
                if (frameCapture) clearInterval(frameCapture);

                // Start regular frame analysis on the secret video
                frameCapture = setInterval(() => {
                    if (!video.paused && video.readyState >= 2) {
                        captureAndAnalyzeFrame(video);
                    }
                }, 3000);

                // Autoplay the chaos video
                video.play();
            }, { once: true });

            return; // IMPORTANT: do not answer the original question
        } catch (error) {
            console.error('Chaos easter egg error:', error);
            speechBubble.show("Chaos miscalculated... try again later! :angry:", "angry");
            return;
        }
    }

    try {
        // Show that Baldi is thinking
        speechBubble.show("Let me think about that... :smallbaldi:", "neutral");
        
        logManager.addLog(logManager.logTypes.BALDI_REACTION, "Received assistance request", {
            query: inputText
        });
        
        // Generate AI response
        const response = await aiAssistant.generateResponse(inputText);
        
        // Show response with appropriate emotion detection
        speechBubble.show(response);
        
        // Clear input
        assistInput.value = '';
    } catch (error) {
        console.error('Assist Button Error:', error);
        speechBubble.show("Oops! Something went wrong. :angry:", "angry");
        
        logManager.addLog(logManager.logTypes.BALDI_REACTION, "Error processing assistance request", {
            error: error.message
        });
    }
});

// Image analysis for assist section
document.getElementById('imageUploadForAssist').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        logManager.addLog(logManager.logTypes.FILE_SELECTION, `Selected image for assistance: ${file.name}`, {
            fileType: file.type,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        });
        
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                speechBubble.show("Analyzing the image... :smallbaldi:", "neutral");
                const analysis = await aiAssistant.analyzeContent(event.target.result, 'image');
                speechBubble.show(analysis);
            } catch (error) {
                console.error('Image Analysis Error:', error);
                speechBubble.show("I couldn't process the image. :angry:", "angry");
                
                logManager.addLog(logManager.logTypes.BALDI_REACTION, "Error analyzing uploaded image", {
                    error: error.message
                });
            }
        };
        reader.readAsDataURL(file);
    }
});

// Screen share functions
document.getElementById('startScreenShare').addEventListener('click', async () => {
    try {
        const mediaStream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                cursor: "always"
            },
            audio: false
        });
        
        const video = document.getElementById('screenShareVideo');
        video.srcObject = mediaStream;
        
        document.getElementById('startScreenShare').disabled = true;
        document.getElementById('stopScreenShare').disabled = false;
        
        logManager.addLog(logManager.logTypes.SCREEN_SHARE, "Screen sharing started", {
            status: "active"
        });
        
        // Start analyzing frames
        if (frameCapture) clearInterval(frameCapture);
        frameCapture = setInterval(() => {
            if (video.srcObject) {
                captureAndAnalyzeFrame(video);
            }
        }, 3000);
        
        // Listen for when user stops sharing via browser UI
        mediaStream.getVideoTracks()[0].addEventListener('ended', () => {
            stopScreenShare();
        });
    } catch (error) {
        console.error('Error starting screen share:', error);
        logManager.addLog(logManager.logTypes.SCREEN_SHARE, "Error starting screen share", {
            status: "error",
            error: error.message
        });
    }
});

document.getElementById('stopScreenShare').addEventListener('click', stopScreenShare);

function stopScreenShare() {
    const video = document.getElementById('screenShareVideo');
    
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
        video.srcObject = null;
    }
    
    document.getElementById('startScreenShare').disabled = false;
    document.getElementById('stopScreenShare').disabled = true;
    
    if (frameCapture) {
        clearInterval(frameCapture);
        frameCapture = null;
    }
    
    logManager.addLog(logManager.logTypes.SCREEN_SHARE, "Screen sharing stopped", {
        status: "stopped"
    });
}

// Cleanup when the page unloads
window.addEventListener('beforeunload', () => {
    cleanupCurrentMode();
});

// Export the logManager to global scope for easy access from console
window.logManager = logManager;