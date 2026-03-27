import { config } from './config.js';
import { speak } from './speech.js';

export class DetentionSystem {
    constructor(chatUI) {
        this.chatUI = chatUI;  // Store reference to chat
        this.createDetentionOverlay();
        this.setupEventListeners();
    }

    createDetentionOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'detention-overlay';
        this.overlay.style.display = 'none';
        this.overlay.innerHTML = `
            <div class="detention-content">
                <span class="lock-icon">🔒</span>
                <div class="detention-timer">15</div>
                <div class="detention-message"></div>
            </div>
        `;
        document.body.appendChild(this.overlay);
    }

    startDetention(mediaElement, reason = 'Inappropriate content detected') {
        if (!config.settings.videoDetention) return;

        // Pause media
        if (mediaElement.pause) {
            mediaElement.pause();
        }

        // Show detention overlay
        this.overlay.style.display = 'flex';
        
        const timer = this.overlay.querySelector('.detention-timer');
        const message = this.overlay.querySelector('.detention-message');
        message.textContent = `Principal's Office: ${reason}`;
        
        // CRITICAL: Change Baldi to permanent angry state during detention
        const baldiImg = document.getElementById('baldiImg');
        baldiImg.src = '/Pngegg_29.webp';
        
        document.dispatchEvent(new Event('detention-start'));
        
        let timeLeft = config.settings.detentionDuration;
        const countdown = setInterval(() => {
            timeLeft--;
            timer.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(countdown);
                this.overlay.style.display = 'none';

                // Restore media controls
                if (mediaElement.play) {
                    mediaElement.play();
                }
                
                // Restore Baldi's default image
                baldiImg.src = '/Baldi Reacting Cropped.png';
                
                document.dispatchEvent(new Event('detention-end'));
            }
        }, 1000);
    }

    setupEventListeners() {
        // Minimal setup, most logic moved to startDetention
    }
}