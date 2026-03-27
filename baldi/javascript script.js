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
import { YouTubePlayer } from './youtube-player.js';
import { AdvancedConversationManager } from './advanced-conversation-manager.js';
import { baldiAI } from './baldi-ai.js';
import { ChatAnalyzer } from './chat-analysis.js';
import { UIVisibilityManager } from './ui-visibility-manager.js';
import { createRulesButton, createRulesPopup } from './rules-popup.js';
import { ScreenShareManager } from './screen-share.js';

// Initialize systems
const chat = new ChatUI();
const detention = new DetentionSystem(chat);
const detentionSettings = new DetentionSettings();
const aiAssistant = new AIAssistant();
const bullyManager = new BullyManager(chat);
const randomCharacterMessages = new RandomCharacterMessages(chat);
const conversationManager = new AdvancedConversationManager(chat);
const characterListPopup = new CharacterListPopup();
const chatAnalyzer = new ChatAnalyzer(chat);
const uiVisibilityManager = new UIVisibilityManager();
const youtubePlayer = new YouTubePlayer();
const screenShareManager = new ScreenShareManager();
randomCharacterMessages.startRandomChatter();
chatAnalyzer.startChatAnalysis();

// Create rules button and popup
createRulesButton();
createRulesPopup();

let chatAnalysisInterval;

function startChatAnalysis() {
    // Ensure Baldi analyzes chat periodically
    setInterval(() => {
        if (baldiAI.analyzeChatPeriodically) {
            baldiAI.analyzeChatPeriodically(chat);
        }
    }, 15000);
}

startChatAnalysis();

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

// Add the upload image button functionality
document.getElementById('uploadImageBtn').addEventListener('click', () => {
    document.getElementById('imageUploadForAssist').click();
});

// Speech bubble component
class SpeechBubble {
    constructor() {
        this.bubble = document.createElement('div');
        this.bubble.className = 'speech-bubble';
        document.querySelector('.baldi-section').appendChild(this.bubble);
        this.baldiImg = document.getElementById('baldiImg');
        this.defaultImage = '/Baldi Reacting Cropped.png';
    }

    async show(text, emotion = null) {
        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `Analyze the emotional content of this text and respond with JSON only:
                        {
                            "emotion": "happy" | "sad" | "shocked" | "angry" | "funny" | "neutral"
                        }`
                    },
                    {
                        role: "user",
                        content: text
                    }
                ],
                json: true
            });

            const response = JSON.parse(completion.content);
            const responseEmotion = response.emotion;

            let emotionToUse;
            if (emotion) {
                emotionToUse = emotion;
            } else {
                emotionToUse = responseEmotion;
            }

            // Change Baldi's image based on emotion
            switch(emotionToUse) {
                case 'shocked':
                    this.baldiImg.src = '/Screenshot 2025-03-25 115650.png';
                    break;
                case 'sad':
                    this.baldiImg.src = '/Screenshot 2025-03-25 115749.png';
                    break;
                case 'angry':
                    this.baldiImg.src = '/Pngegg_29.webp';
                    break;
                case 'funny':
                    this.baldiImg.src = '/com.funnybaldimod.baldicantstoplaughing-a9061289-892e-4d28-830c-65780d59d990_512x512.webp';
                    break;
                case 'distorted':
                case 'error':
                case 'blind':
                case 'old':
                case 'glitch':
                    this.baldiImg.src = '/Screenshot 2025-04-20 122038.png'; 
                    break;
                case 'scared':
                    this.baldiImg.src = '/Screenshot 2025-03-26 172041.png';
                    break;
                default:
                    this.baldiImg.src = this.defaultImage;
            }

            this.bubble.textContent = text;
            this.bubble.style.opacity = '1';
            
            // Reset image after speech bubble (now 5 seconds for slower reactions)
            setTimeout(() => {
                this.bubble.style.opacity = '0';
                setTimeout(() => {
                    this.baldiImg.src = this.defaultImage;
                }, 300);
            }, 5000);

        } catch (error) {
            console.error('Error analyzing emotion:', error);
            this.baldiImg.src = this.defaultImage;
            this.bubble.textContent = text;
            this.bubble.style.opacity = '1';
            setTimeout(() => {
                this.bubble.style.opacity = '0';
            }, 5000);
        }
    }
}

const speechBubble = new SpeechBubble();

document.getElementById('videoInput').addEventListener('change', async function(e) {
    cleanupCurrentMode();
    const file = e.target.files[0];
    const video = document.getElementById('videoPlayer');
    
    if (file) {
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
            
            // Start a conversation
            conversationManager.startRandomConversation();
        }

        video.addEventListener('loadeddata', async () => {
            speechBubble.show("Alright, everyone! Let's watch this video! :happy:", "happy");
            
            if (frameCapture) clearInterval(frameCapture);
            frameCapture = setInterval(() => {
                if (!video.paused && video.readyState >= 2) {
                    captureAndAnalyzeFrame(video);
                }
            }, 2000); 
            conversationManager.startRandomConversation();
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
    conversationManager.startRandomConversation();
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
    conversationManager.startRandomConversation();
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
    conversationManager.startRandomConversation();
});

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
    conversationManager.startRandomConversation();
});

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
    
    // Start a random conversation when switching modes
    if (conversationManager) {
        conversationManager.startRandomConversation();
    }
});

// Photo upload handling
document.getElementById('photoInput').addEventListener('change', async function(e) {
    cleanupCurrentMode(); 
    const file = e.target.files[0];
    if (file) {
        await handlePhotoUpload(file);
        conversationManager.startRandomConversation();
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
                        messages: [
                            {
                                role: "system",
                                content: `You are Baldi reacting to audio. The current average volume is ${average}/255. 
                                Respond with a natural, very short reaction (less than 10 words) and include one emoji.`
                            },
                            {
                                role: "user",
                                content: "What's your reaction to this audio segment?"
                            }
                        ]
                    });

                    // Show response with appropriate emotion detection
                    speechBubble.show(completion.content);
                    
                } catch (error) {
                    console.error('Audio analysis error:', error);
                    speechBubble.show("Hmm, interesting sounds! :quarter:", "neutral");
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
    
    // Stop YouTube frame capture if active
    if (youtubePlayer && youtubePlayer.frameCapture) {
        youtubePlayer.stopFrameCapture();
    }
    
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
    
    // Stop screen sharing if active
    if (screenShareManager && screenShareManager.mediaStream) {
        screenShareManager.stopScreenShare();
    }
    
    // Make sure main video player is visible again
    document.getElementById('videoPlayer').style.display = 'block';
    
    // Add conversation restart logic
    if (conversationManager) {
        conversationManager.startRandomConversation();
    }

    // Restart random character messages if they've stopped
    if (randomCharacterMessages && !randomCharacterMessages.chatInterval) {
        randomCharacterMessages.startRandomChatter();
    }
}

// Detention system event listeners
document.addEventListener('detention-start', () => {
    const baldiImg = document.getElementById('baldiImg');
    baldiImg.src = '/Screenshot 2025-04-20 122636.png'; // Use detention image
    speak("YOU BROKE THE RULES! DETENTION NOW!");
});

document.addEventListener('detention-end', () => {
    const baldiImg = document.getElementById('baldiImg');
    baldiImg.src = '/Baldi Reacting Cropped.png';
    speak("You're free to go now. Be good!");
});

// Assist section event listener
document.getElementById('assistButton').addEventListener('click', async () => {
    const assistInput = document.getElementById('assistInput');
    const inputText = assistInput.value.trim();
    
    if (!inputText) return;

    try {
        // Show that Baldi is thinking
        speechBubble.show("Let me think about that... :smallbaldi:", "neutral");
        
        // Generate AI response
        const response = await aiAssistant.generateResponse(inputText);
        
        // Show response with appropriate emotion detection
        speechBubble.show(response);
        
        // Clear input
        assistInput.value = '';
    } catch (error) {
        console.error('Assist Button Error:', error);
        speechBubble.show("Oops! Something went wrong. :angry:", "angry");
    }
});

// Image analysis for assist section
document.getElementById('imageUploadForAssist').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                speechBubble.show("Analyzing the image... :smallbaldi:", "neutral");
                const analysis = await aiAssistant.analyzeContent(event.target.result, 'image');
                speechBubble.show(analysis);
            } catch (error) {
                console.error('Image Analysis Error:', error);
                speechBubble.show("I couldn't process the image. :angry:", "angry");
            }
        };
        reader.readAsDataURL(file);
    }
});

// Cleanup when the page unloads
window.addEventListener('beforeunload', () => {
    cleanupCurrentMode();
    
    // Clear chat analysis interval
    if (chatAnalysisInterval) {
        clearInterval(chatAnalysisInterval);
    }
});