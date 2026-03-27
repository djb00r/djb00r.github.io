import { config } from './config.js';
import { speak } from './speech.js';
import { AIReactions } from './ai-reactions.js';

export class DetentionManager {
    constructor(chatUI = null) {
        this.chatUI = chatUI;
        this.createDetentionOverlay();
        this.setupEventListeners();
        this.detentionReason = '';
        
        // Get the log manager if it exists
        this.logManager = window.logManager;
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
                <div class="detention-reason"></div>
            </div>
        `;
        document.body.appendChild(this.overlay);
    }

    setupEventListeners() {
        document.addEventListener('detention-start', () => {
            const baldiImg = document.getElementById('baldiImg');
            baldiImg.src = '/Pngegg_29.webp'; // Angry Baldi
            speak("YOU BROKE THE RULES! DETENTION NOW!");
            
            // Log the detention if logManager exists
            if (this.logManager) {
                this.logManager.addLog(this.logManager.logTypes.DETENTION, "Detention started", {
                    reason: this.detentionReason || "Unknown reason",
                    status: "active"
                });
                
                this.logManager.addLog(this.logManager.logTypes.PRINCIPAL_MESSAGE, "YOU BROKE THE RULES! DETENTION NOW!", {
                    type: "detention-announcement"
                });
            }
        });

        document.addEventListener('detention-end', () => {
            const baldiImg = document.getElementById('baldiImg');
            baldiImg.src = '/Baldi Reacting Cropped.png';
            speak("You're free to go now. Be good!");
            
            // Log the detention ending if logManager exists
            if (this.logManager) {
                this.logManager.addLog(this.logManager.logTypes.DETENTION, "Detention ended", {
                    status: "complete",
                    reason: this.detentionReason || "Unknown reason"
                });
                
                this.logManager.addLog(this.logManager.logTypes.PRINCIPAL_MESSAGE, "You're free to go now. Be good!", {
                    type: "detention-release"
                });
            }
        });
    }

    async startDetention(mediaElement, type = 'video') {
        if (!config.settings.videoDetention) return;

        try {
            let dataUrl;
            if (type === 'video') {
                const canvas = document.createElement('canvas');
                canvas.width = mediaElement.videoWidth;
                canvas.height = mediaElement.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(mediaElement, 0, 0, canvas.width, canvas.height);
                dataUrl = canvas.toDataURL('image/jpeg');
            } else if (type === 'photo') {
                dataUrl = mediaElement.src;
            }

            const safetyCheck = await AIReactions.checkVideoContent(dataUrl);
            
            if (safetyCheck.detentionRequired) {
                if (type === 'video') {
                    mediaElement.pause();
                    mediaElement.currentTime = 0; 
                    mediaElement.removeAttribute('controls'); 
                }

                this.overlay.style.display = 'flex';
                
                const timer = this.overlay.querySelector('.detention-timer');
                const message = this.overlay.querySelector('.detention-message');
                const reasonElement = this.overlay.querySelector('.detention-reason');
                
                console.warn('Detention Triggered:', {
                    type: type,
                    reason: safetyCheck.inappropriateCategories,
                    severity: safetyCheck.severityLevel
                });

                this.detentionReason = safetyCheck.detentionMessage || 
                    'Inappropriate content detected.';
                
                message.textContent = 'DETENTION!';
                reasonElement.textContent = `Reason: ${this.detentionReason}`;
                
                document.dispatchEvent(new Event('detention-start'));
                
                // Set detention image
                const baldiImg = document.getElementById('baldiImg');
                baldiImg.src = '/Screenshot 2025-04-20 122636.png'; // Use the detention image
                
                // Log detention with detailed reason if logManager exists
                if (window.logManager) {
                    window.logManager.addLog(window.logManager.logTypes.DETENTION, "Detention triggered", {
                        reason: this.detentionReason,
                        type: type,
                        severity: safetyCheck.severityLevel || "medium",
                        duration: `${config.settings.detentionDuration} seconds`
                    });
                }
                
                let timeLeft = config.settings.detentionDuration;
                const countdown = setInterval(() => {
                    timeLeft--;
                    timer.textContent = timeLeft;
                    
                    if (timeLeft <= 0) {
                        clearInterval(countdown);
                        this.overlay.style.display = 'none';
                        
                        if (type === 'video') {
                            mediaElement.setAttribute('controls', true);
                        } else if (type === 'photo') {
                            mediaElement.style.filter = 'none';
                        }
                        
                        document.dispatchEvent(new Event('detention-end'));
                    }
                }, 1000);

                this.triggerDetentionChatChaos();

                if (type === 'video') {
                    mediaElement.addEventListener('play', this.preventPlayDuringDetention.bind(this));
                }

                if (type === 'photo') {
                    mediaElement.style.filter = 'grayscale(100%) blur(5px)';
                }
            }
        } catch (error) {
            console.error('Error during detention check:', error);
        }
    }

    preventPlayDuringDetention(event) {
        event.preventDefault();
        event.target.pause();
        speak("YOU CANNOT PLAY DURING DETENTION!");
        
        // Log detention violation if logManager exists
        if (window.logManager) {
            window.logManager.addLog(window.logManager.logTypes.PRINCIPAL_MESSAGE, "YOU CANNOT PLAY DURING DETENTION!", {
                type: "detention-violation",
                action: "attempted-video-play"
            });
        }
    }

    triggerDetentionChatChaos() {
        if (!this.chatUI) return;

        const chaosMessages = [
            'DETENTION ALERT! INAPPROPRIATE CONTENT DETECTED! :angry:',
            'THE PRINCIPAL IS WATCHING! :mad:',
            'NO ESCAPE FROM DETENTION! :lock:',
            'RULES HAVE BEEN BROKEN! :quarter:',
            'CHAOS IN THE CHAT! :smallbaldi:',
            'EVERYONE PANIC! :funny:',
            'THIS IS NOT A DRILL! :angry:',
            'DETENTION MODE ACTIVATED! :mad:',
            'WHO BROKE THE RULES? :quarter:',
            'BALDI IS FURIOUS! :smallbaldi:'
        ];

        const chaosInterval = setInterval(() => {
            const randomMessage = chaosMessages[Math.floor(Math.random() * chaosMessages.length)];
            this.chatUI.addMessage('System', randomMessage);
            
            // Log chaos messages if logManager exists
            if (window.logManager) {
                window.logManager.addLog(window.logManager.logTypes.PRINCIPAL_MESSAGE, randomMessage, {
                    type: "detention-chaos"
                });
            }
        }, 1000);

        document.addEventListener('detention-end', () => {
            clearInterval(chaosInterval);
        }, { once: true });
    }
}