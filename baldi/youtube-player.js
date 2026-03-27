import { captureAndAnalyzeFrame } from './reactions.js';
import { DetentionManager } from './detention-manager.js';

export class YouTubePlayer {
    constructor() {
        this.player = null;
        this.frameCapture = null;
        this.detentionManager = new DetentionManager();
        this.setupYouTubeAPI();
    }

    setupYouTubeAPI() {
        // Load YouTube IFrame Player API code asynchronously
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // Set up global callback for when YouTube API is ready
        window.onYouTubeIframeAPIReady = () => {
            this.createYouTubeContainer();
        };
    }

    createYouTubeContainer() {
        const videoSection = document.querySelector('.video-section');
        const youtubeMode = document.createElement('div');
        youtubeMode.id = 'youtubeMode';
        youtubeMode.style.display = 'none';
        youtubeMode.innerHTML = `
            <div class="youtube-controls">
                <input type="text" id="youtubeUrl" placeholder="Enter YouTube URL or Video ID">
                <button id="loadYoutubeVideo">Load Video</button>
            </div>
            <div id="youtubePlayer"></div>
        `;
        videoSection.appendChild(youtubeMode);

        // Add button to mode selector
        const modeSelector = document.querySelector('.mode-selector');
        const youtubeBtn = document.createElement('button');
        youtubeBtn.id = 'youtubeModeBtn';
        youtubeBtn.className = 'mode-btn';
        youtubeBtn.textContent = 'YouTube Mode';
        modeSelector.appendChild(youtubeBtn);

        // Setup event listeners
        document.getElementById('loadYoutubeVideo').addEventListener('click', () => {
            this.loadVideo(document.getElementById('youtubeUrl').value);
        });

        document.getElementById('youtubeModeBtn').addEventListener('click', () => {
            this.activateYoutubeMode();
        });
    }

    activateYoutubeMode() {
        // Hide other modes, show YouTube mode
        document.getElementById('videoMode').style.display = 'none';
        document.getElementById('photoMode').style.display = 'none';
        document.getElementById('audioMode').style.display = 'none';
        document.getElementById('youtubeMode').style.display = 'block';
        
        // Update active button
        document.getElementById('videoModeBtn').classList.remove('active');
        document.getElementById('photoModeBtn').classList.remove('active');
        document.getElementById('audioModeBtn').classList.remove('active');
        document.getElementById('youtubeModeBtn').classList.add('active');
        
        // Initialize player if not already done
        if (!this.player) {
            this.initializePlayer();
        }
    }

    initializePlayer() {
        this.player = new YT.Player('youtubePlayer', {
            height: '360',
            width: '640',
            videoId: '',
            playerVars: {
                'playsinline': 1,
                'controls': 1
            },
            events: {
                'onReady': this.onPlayerReady.bind(this),
                'onStateChange': this.onPlayerStateChange.bind(this)
            }
        });
    }

    onPlayerReady(event) {
        console.log('YouTube player ready');
    }

    onPlayerStateChange(event) {
        // YT.PlayerState.PLAYING = 1
        if (event.data === YT.PlayerState.PLAYING) {
            this.startFrameCapture();
        } else {
            this.stopFrameCapture();
        }
    }

    startFrameCapture() {
        if (this.frameCapture) {
            clearInterval(this.frameCapture);
        }
        
        this.frameCapture = setInterval(() => {
            this.captureFrame();
        }, 3000); // Capture frame every 3 seconds
    }

    stopFrameCapture() {
        if (this.frameCapture) {
            clearInterval(this.frameCapture);
            this.frameCapture = null;
        }
    }

    async captureFrame() {
        try {
            // Create a canvas to capture the YouTube video frame
            const canvas = document.createElement('canvas');
            const ytElement = document.querySelector('#youtubePlayer iframe');
            
            if (!ytElement) return;
            
            const width = ytElement.clientWidth;
            const height = ytElement.clientHeight;
            
            canvas.width = width;
            canvas.height = height;
            
            // Create a temporary video element to capture frame
            const tempVideo = document.createElement('video');
            tempVideo.width = width;
            tempVideo.height = height;
            tempVideo.crossOrigin = 'anonymous';
            
            // Use the YouTube video URL
            const videoId = this.player.getVideoData().video_id;
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
            
            // Backup method: render a snapshot of the player
            const html2canvas = await import('html2canvas');
            const canvasElement = await html2canvas.default(ytElement);
            const dataUrl = canvasElement.toDataURL('image/jpeg');
            captureAndAnalyzeFrame({ 
                videoWidth: width,
                videoHeight: height,
                snapshot: dataUrl 
            });
        } catch (error) {
            console.error('Error capturing YouTube frame:', error);
        }
    }

    loadVideo(urlOrId) {
        let videoId = urlOrId;
        
        // Extract video ID if a full URL was provided
        if (urlOrId.includes('youtube.com') || urlOrId.includes('youtu.be')) {
            const url = new URL(urlOrId);
            if (urlOrId.includes('youtube.com/watch')) {
                videoId = url.searchParams.get('v');
            } else if (urlOrId.includes('youtu.be/')) {
                videoId = url.pathname.substring(1);
            }
        }
        
        if (videoId && this.player) {
            this.player.loadVideoById(videoId);
        }
    }
}
