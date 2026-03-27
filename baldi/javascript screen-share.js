import { captureAndAnalyzeFrame } from './reactions.js';

export class ScreenShareManager {
    constructor() {
        this.mediaStream = null;
        this.frameCapture = null;
        this.captureInterval = 3000; // 3 seconds between captures
        this.video = document.getElementById('screenShareVideo');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        const startButton = document.getElementById('startScreenShare');
        const stopButton = document.getElementById('stopScreenShare');
        
        if (startButton) {
            startButton.addEventListener('click', () => this.startScreenShare());
        }
        
        if (stopButton) {
            stopButton.addEventListener('click', () => this.stopScreenShare());
        }
    }

    async startScreenShare() {
        try {
            // Request screen capture permission
            this.mediaStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: "always"
                },
                audio: false
            });
            
            // Stream to video element
            if (this.video) {
                this.video.srcObject = this.mediaStream;
            }
            
            // Enable stop button, disable start button
            const startButton = document.getElementById('startScreenShare');
            const stopButton = document.getElementById('stopScreenShare');
            
            if (startButton) startButton.disabled = true;
            if (stopButton) stopButton.disabled = false;
            
            // Start analyzing frames
            this.startFrameCapture();
            
            // Listen for when user stops sharing via browser UI
            this.mediaStream.getVideoTracks()[0].addEventListener('ended', () => {
                this.stopScreenShare();
            });
            
            // Announce start of screen sharing
            import('./speech-bubble.js').then(module => {
                const SpeechBubble = module.SpeechBubble;
                const speechBubble = new SpeechBubble();
                speechBubble.show("I can see your screen now! Let's explore together! :happy:", "happy");
            });
        } catch (error) {
            console.error('Error starting screen share:', error);
            alert('Unable to start screen sharing. Please try again.');
        }
    }

    stopScreenShare() {
        // Stop all tracks
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
        }
        
        // Clear video source
        if (this.video) {
            this.video.srcObject = null;
        }
        
        // Stop frame capture
        this.stopFrameCapture();
        
        // Reset buttons
        const startButton = document.getElementById('startScreenShare');
        const stopButton = document.getElementById('stopScreenShare');
        
        if (startButton) startButton.disabled = false;
        if (stopButton) stopButton.disabled = true;
        
        // Announce end of screen sharing
        import('./speech-bubble.js').then(module => {
            const SpeechBubble = module.SpeechBubble;
            const speechBubble = new SpeechBubble();
            speechBubble.show("Screen sharing stopped! Thanks for showing me! :quarter:", "neutral");
        });
    }

    startFrameCapture() {
        // Import the reactions module and start capturing frames
        import('./reactions.js').then(module => {
            // Clear any existing interval
            this.stopFrameCapture();
            
            // Set up new interval
            this.frameCapture = setInterval(() => {
                if (this.video && this.video.srcObject) {
                    module.captureAndAnalyzeFrame(this.video);
                }
            }, this.captureInterval);
        }).catch(error => {
            console.error('Error importing reactions module:', error);
        });
    }

    stopFrameCapture() {
        if (this.frameCapture) {
            clearInterval(this.frameCapture);
            this.frameCapture = null;
        }
    }
}