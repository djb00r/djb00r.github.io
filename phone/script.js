class DontBreakThePhoneGame {
    constructor() {
        this.clickCount = 0;
        this.faceClickCount = 0;
        this.maxClicks = 15;
        this.gameEnded = false;
        this.patienceTimer = null;
        this.patienceTime = 30000; // 30 seconds
        
        // Phone power state
        this.phonePowered = false;
        this.currentScreen = 'off';
        this.photoCount = 0;
        this.phoneNumber = '';
        this.bootCount = 0;
        
        // Ending tracking
        this.achievedEndings = new Set();
        
        // Achievement tracking
        this.totalClicks = 0;
        this.gameStartTime = Date.now();
        this.waitStartTime = null;
        this.achievedAchievements = new Set();
        this.stats = {
            firstPlay: false,
            firstClick: false,
            totalClicks: 0,
            bootCount: 0,
            maxWaitTime: 0
        };
        
        // Load achievements from localStorage
        this.loadAchievements();
        
        // New ending tracking variables
        this.clickTimes = [];
        this.lastClickType = null;
        this.alternatingCount = 0;
        this.perfectBalanceTimer = null;
        this.clickSequence = [];
        this.lastClickTime = 0;
        this.doubleTapCount = 0;
        
        // Hammer functionality
        this.hammerGrabbed = false;
        this.emojiDumb = false;
        this.emojiAngry = false;
        
        this.elements = {
            phone: document.getElementById('gamePhone'),
            phoneScreen: document.getElementById('phoneScreen'),
            powerButton: document.getElementById('powerButton'),
            bootupScreen: document.getElementById('bootupScreen'),
            appsScreen: document.getElementById('appsScreen'),
            youtubeApp: document.getElementById('youtubeApp'),
            cameraApp: document.getElementById('cameraApp'),
            phoneApp: document.getElementById('phoneApp'),
            youtubeScreen: document.getElementById('youtubeScreen'),
            cameraScreen: document.getElementById('cameraScreen'),
            phoneCallScreen: document.getElementById('phoneCallScreen'),
            videoPlayer: document.getElementById('videoPlayer'),
            soccerVideo: document.getElementById('soccerVideo'),
            sharkVideo: document.getElementById('sharkVideo'),
            emojiPreview: document.getElementById('emojiPreview'),
            photoCount: document.getElementById('photoCount'),
            captureButton: document.getElementById('captureButton'),
            phoneNumberDisplay: document.getElementById('phoneNumberDisplay'),
            callButton: document.getElementById('callButton'),
            videoContent: document.getElementById('videoContent'),
            clickCounter: document.getElementById('clickCount'),
            dangerBar: document.getElementById('dangerBar'),
            face: document.getElementById('emotionFace'),
            warningText: document.getElementById('warningText'),
            screenCrack: document.getElementById('screenCrack'),
            gameOverScreen: document.getElementById('gameOverScreen'),
            endingTitle: document.getElementById('endingTitle'),
            endingMessage: document.getElementById('endingMessage'),
            resetButton: document.getElementById('resetButton'),
            endingsButton: document.getElementById('endingsButton'),
            endingsScreen: document.getElementById('endingsScreen'),
            closeEndingsButton: document.getElementById('closeEndingsButton'),
            hammer: document.getElementById('hammer'),
            toolbox: document.getElementById('toolbox'),
            heavenButton: document.getElementById('heavenButton'),
            heavenScreen: document.getElementById('heavenScreen'),
            heavenStartButton: document.getElementById('heavenStartButton'),
            galaxyButton: document.getElementById('galaxyButton'),
            galaxyS7: document.getElementById('galaxyS7'),
            killstickButton: document.getElementById('killstickButton'),
            toiletButton: document.getElementById('toiletButton'),
            toiletScreen: document.getElementById('toiletScreen'),
            toiletPhone: document.getElementById('toiletPhone'),
            flushButton: document.getElementById('flushButton'),
            ksiButton: document.getElementById('ksiButton'),
            ksiScreen: document.getElementById('ksiScreen'),
            ksiHqScreen: document.getElementById('ksiHqScreen'),
            angryEmoji: document.getElementById('angryEmoji'),
            flyingPhone: document.getElementById('flyingPhone'),
            ksiPerson: document.getElementById('ksiPerson'),
            achievementNotification: document.getElementById('achievementNotification'),
            achievementsButton: document.getElementById('achievementsButton'),
            achievementsScreen: document.getElementById('achievementsScreen'),
            closeAchievementsButton: document.getElementById('closeAchievementsButton')
        };
        
        this.emotions = {
            0: '😊',    // Happy
            3: '😐',    // Neutral
            6: '😟',    // Worried
            9: '😰',    // Sweating
            12: '😱',   // Scared
            15: '💀'    // Dead/Broken
        };
        
        this.warnings = {
            0: "Try not to click the phone too much!",
            3: "Be careful now...",
            6: "The phone is getting stressed!",
            9: "DANGER! Stop clicking!",
            12: "IT'S ABOUT TO BREAK!",
            15: "💥 PHONE DESTROYED! 💥"
        };
        
        this.achievements = [
            { id: 'first_play', title: 'Welcome!', description: 'Started playing the game for the first time', points: '10G', icon: '🎮', condition: () => true },
            { id: 'first_click', title: 'First Touch', description: 'Clicked the phone for the first time', points: '5G', icon: '👆', condition: () => this.stats.totalClicks >= 1 },
            { id: 'click_100', title: 'Century Club', description: 'Clicked the phone 100 times total', points: '20G', icon: '💯', condition: () => this.stats.totalClicks >= 100 },
            { id: 'click_500', title: 'Click Master', description: 'Clicked the phone 500 times total', points: '35G', icon: '🔥', condition: () => this.stats.totalClicks >= 500 },
            { id: 'click_1000', title: 'Thousand Taps', description: 'Clicked the phone 1000 times total', points: '50G', icon: '⚡', condition: () => this.stats.totalClicks >= 1000 },
            { id: 'click_5000', title: 'Click Maniac', description: 'Clicked the phone 5000 times total', points: '75G', icon: '🚀', condition: () => this.stats.totalClicks >= 5000 },
            { id: 'click_10000', title: 'Ultimate Clicker', description: 'Clicked the phone 10000 times total', points: '100G', icon: '👑', condition: () => this.stats.totalClicks >= 10000 },
            { id: 'first_boot', title: 'Powered On My Pear Phone?', description: 'Turned on the phone for the first time', points: '15G', icon: '📱', condition: () => this.stats.bootCount >= 1 },
            { id: 'boot_100', title: 'Boot Master', description: 'Booted up the phone 100 times', points: '40G', icon: '🔄', condition: () => this.stats.bootCount >= 100 },
            { id: 'wait_1min', title: 'Patient Beginner', description: 'Waited 1 minute without clicking', points: '15G', icon: '⏰', condition: () => this.stats.maxWaitTime >= 60000 },
            { id: 'wait_5min', title: 'Patience Practiced', description: 'Waited 5 minutes without clicking', points: '25G', icon: '🕐', condition: () => this.stats.maxWaitTime >= 300000 },
            { id: 'wait_10min', title: 'Zen Master', description: 'Waited 10 minutes without clicking', points: '40G', icon: '🧘', condition: () => this.stats.maxWaitTime >= 600000 },
            { id: 'wait_30min', title: 'Meditation Expert', description: 'Waited 30 minutes without clicking', points: '60G', icon: '🕯️', condition: () => this.stats.maxWaitTime >= 1800000 },
            { id: 'wait_1hour', title: 'Ultimate Patience', description: 'Waited 1 hour without clicking', points: '100G', icon: '🏆', condition: () => this.stats.maxWaitTime >= 3600000 }
        ];
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.elements.phone.addEventListener('click', (e) => {
            if (e.target === this.elements.powerButton) return;
            this.handlePhoneClick();
        });
        this.elements.face.addEventListener('click', () => this.handleFaceClick());
        this.elements.resetButton.addEventListener('click', () => this.resetGame());
        this.elements.endingsButton.addEventListener('click', () => this.showEndingsScreen());
        this.elements.closeEndingsButton.addEventListener('click', () => this.hideEndingsScreen());
        this.elements.hammer.addEventListener('mousedown', (e) => this.grabHammer(e));
        this.elements.heavenButton.addEventListener('click', () => this.showHeavenScreen());
        this.elements.heavenStartButton.addEventListener('click', () => this.startThrowingGame());
        this.elements.galaxyButton.addEventListener('click', () => this.throwGalaxyS7());
        this.elements.killstickButton.addEventListener('click', () => this.plugKillstick());
        this.elements.toiletButton.addEventListener('click', () => this.showToiletScreen());
        this.elements.flushButton.addEventListener('click', () => this.flushToilet());
        this.elements.ksiButton.addEventListener('click', () => this.forceListenKSI());
        
        // Phone power and app event listeners
        this.elements.powerButton.addEventListener('click', () => this.togglePower());
        this.elements.youtubeApp.addEventListener('click', () => this.openYouTube());
        this.elements.cameraApp.addEventListener('click', () => this.openCamera());
        this.elements.phoneApp.addEventListener('click', () => this.openPhoneApp());
        this.elements.soccerVideo.addEventListener('click', () => this.playVideo('soccer'));
        this.elements.sharkVideo.addEventListener('click', () => this.playVideo('shark'));
        this.elements.captureButton.addEventListener('click', () => this.takePhoto());
        this.elements.callButton.addEventListener('click', () => this.makeCall());
        
        // Back buttons
        document.getElementById('youtubeBack').addEventListener('click', () => this.showAppsScreen());
        document.getElementById('cameraBack').addEventListener('click', () => this.showAppsScreen());
        document.getElementById('phoneBack').addEventListener('click', () => this.showAppsScreen());
        document.getElementById('videoBack').addEventListener('click', () => this.showYouTubeScreen());
        
        // Keypad buttons
        document.querySelectorAll('.keypad-button').forEach(button => {
            button.addEventListener('click', () => this.addDigit(button.dataset.number));
        });
        
        document.addEventListener('mousemove', (e) => this.moveHammer(e));
        document.addEventListener('mouseup', () => this.releaseHammer());
        this.startPatienceTimer();
        this.updateDisplay();
        
        // Check first play achievement
        if (!this.stats.firstPlay) {
            this.stats.firstPlay = true;
            this.saveAchievements();
            this.checkAchievement('first_play');
        }
        
        this.startWaitTimer();
    }
    
    togglePower() {
        if (this.gameEnded) return;
        
        this.phonePowered = !this.phonePowered;
        
        if (this.phonePowered) {
            this.bootCount++;
            this.stats.bootCount++;
            this.saveAchievements();
            
            // Check boot achievements
            this.checkAchievement('first_boot');
            this.checkAchievement('boot_100');
            
            // Cancel patience timer when phone is powered on
            if (this.patienceTimer) {
                clearTimeout(this.patienceTimer);
            }
            
            this.currentScreen = 'bootup';
            this.elements.bootupScreen.classList.add('show');
            
            setTimeout(() => {
                this.elements.bootupScreen.classList.remove('show');
                this.showAppsScreen();
            }, 2000);
        } else {
            this.currentScreen = 'off';
            this.hideAllScreens();
        }
    }
    
    showAppsScreen() {
        this.currentScreen = 'apps';
        this.hideAllScreens();
        this.elements.appsScreen.classList.add('show');
        this.updateDisplay(); // Update emoji when showing apps
    }
    
    openYouTube() {
        this.currentScreen = 'youtube';
        this.hideAllScreens();
        this.elements.youtubeScreen.classList.add('show');
        this.updateDisplay(); // Update emoji when entering YouTube
    }
    
    showYouTubeScreen() {
        this.currentScreen = 'youtube';
        this.hideAllScreens();
        this.elements.youtubeScreen.classList.add('show');
    }
    
    openCamera() {
        this.currentScreen = 'camera';
        this.hideAllScreens();
        this.elements.cameraScreen.classList.add('show');
        this.updateDisplay(); // Update emoji when entering camera
        this.updateEmojiPreview();
    }
    
    openPhoneApp() {
        this.currentScreen = 'phone';
        this.hideAllScreens();
        this.elements.phoneCallScreen.classList.add('show');
        this.updateDisplay(); // Update emoji when entering phone
    }
    
    playVideo(videoType) {
        this.currentScreen = 'video';
        this.hideAllScreens();
        this.elements.videoPlayer.classList.add('show');
        this.updateDisplay(); // Update emoji when entering video
        
        if (videoType === 'soccer') {
            this.elements.videoContent.innerHTML = `
                <div class="video-title">Top 10 Best Soccer Wins</div>
                <img src="ronaldo.png" alt="Ronaldo Goal" class="video-image">
                <div class="video-text">GOOOOOAL! Ronaldo scores!</div>
            `;
            
            this.playSound('goal');
            this.elements.face.textContent = '😍'; // Star eyes while watching soccer
            
            setTimeout(() => {
                const soccerBall = document.createElement('img');
                soccerBall.src = 'soccer_ball.png';
                soccerBall.className = 'flying-soccer-ball';
                document.body.appendChild(soccerBall);
                
                this.elements.face.textContent = '😱'; // Shocked when ball comes
                
                setTimeout(() => {
                    this.playSound('break');
                    this.elements.phone.classList.add('broken');
                    this.elements.screenCrack.classList.add('visible');
                    document.body.removeChild(soccerBall);
                    this.endGame('soccerball');
                }, 2000);
            }, 3000);
            
        } else if (videoType === 'shark') {
            this.elements.videoContent.innerHTML = `
                <div class="video-title">Tralelelo Trallala Shark</div>
                <div class="shark-video">🦈</div>
                <div class="video-text">Tralelelo Trallala... 🎵</div>
            `;
            
            this.elements.face.textContent = '🤔'; // Curious at first
            
            setTimeout(() => {
                this.elements.face.textContent = '🤢';
                this.elements.face.classList.add('cringe');
                this.playSound('cringe');
                
                setTimeout(() => {
                    this.elements.face.textContent = '🤮';
                    setTimeout(() => {
                        this.endGame('cringe');
                    }, 1000);
                }, 2000);
            }, 3000);
        }
    }
    
    takePhoto() {
        if (this.photoCount >= 25) return;
        
        this.playSound('camera_snap');
        this.photoCount++;
        this.elements.photoCount.textContent = this.photoCount;
        
        // Change emoji reaction based on photo count
        if (this.photoCount <= 5) {
            this.elements.face.textContent = '😊'; // Happy for first few photos
        } else if (this.photoCount <= 15) {
            this.elements.face.textContent = '😐'; // Getting tired
        } else if (this.photoCount <= 22) {
            this.elements.face.textContent = '😒'; // Annoyed
        } else {
            this.elements.face.textContent = '😡'; // Angry at too many photos
        }
        
        // Flash effect
        this.elements.cameraScreen.classList.add('flash');
        setTimeout(() => {
            this.elements.cameraScreen.classList.remove('flash');
        }, 200);
        
        if (this.photoCount >= 25) {
            this.elements.captureButton.disabled = true;
            this.elements.captureButton.textContent = 'STORAGE FULL!';
            this.elements.face.textContent = '🤯'; // Mind blown from too many photos
            
            setTimeout(() => {
                this.playSound('explosion');
                this.elements.phone.classList.add('storage-exploded');
                this.elements.screenCrack.classList.add('visible');
                this.endGame('storage');
            }, 2000);
        }
    }
    
    addDigit(digit) {
        if (this.phoneNumber.length < 10) {
            this.phoneNumber += digit;
            this.elements.phoneNumberDisplay.textContent = this.phoneNumber;
        }
    }
    
    makeCall() {
        if (this.phoneNumber.length === 0) return;
        
        this.playSound('phone_ring');
        this.elements.face.textContent = '😬'; // Nervous face while calling
        
        setTimeout(() => {
            // Use emoji instead of image
            const dadEmoji = document.createElement('div');
            dadEmoji.textContent = '🙎‍♂️';
            dadEmoji.className = 'angry-dad';
            dadEmoji.style.fontSize = '4rem';
            document.body.appendChild(dadEmoji);
            
            this.elements.face.textContent = '😰'; // Scared when dad appears
            
            setTimeout(() => {
                this.elements.face.textContent = '😰';
                this.elements.warningText.textContent = 'Dad is taking away the phone for the high phone bill!';
                
                setTimeout(() => {
                    document.body.removeChild(dadEmoji);
                    this.endGame('phonebill');
                }, 2000);
            }, 1000);
        }, 3000);
    }
    
    updateEmojiPreview() {
        if (!this.emojiDumb && !this.emojiAngry) {
            const emotionKey = Object.keys(this.emotions)
                .reverse()
                .find(key => this.clickCount >= parseInt(key));
            this.elements.emojiPreview.textContent = this.emotions[emotionKey];
        }
    }
    
    hideAllScreens() {
        this.elements.bootupScreen.classList.remove('show');
        this.elements.appsScreen.classList.remove('show');
        this.elements.youtubeScreen.classList.remove('show');
        this.elements.cameraScreen.classList.remove('show');
        this.elements.phoneCallScreen.classList.remove('show');
        this.elements.videoPlayer.classList.remove('show');
    }

    handlePhoneClick() {
        if (this.gameEnded || this.hammerGrabbed || this.phonePowered) return;
        
        this.playSound('click');
        
        // Track total clicks for achievements
        this.totalClicks++;
        this.stats.totalClicks++;
        this.saveAchievements();
        
        // Check click achievements
        if (this.stats.totalClicks === 1) {
            this.checkAchievement('first_click');
        }
        this.checkAchievement('click_100');
        this.checkAchievement('click_500');
        this.checkAchievement('click_1000');
        this.checkAchievement('click_5000');
        this.checkAchievement('click_10000');
        
        // Reset wait timer
        this.resetWaitTimer();
        
        const now = Date.now();
        this.clickTimes.push(now);
        this.clickSequence.push('phone');
        
        // Remove double tap logic
        this.lastClickTime = now;
        
        // Check for alternating pattern
        if (this.lastClickType === 'face') {
            this.alternatingCount++;
            if (this.alternatingCount >= 20) { // 10 phone + 10 face alternating
                this.endGame('alternating');
                return;
            }
        } else if (this.lastClickType === 'phone') {
            this.alternatingCount = 0;
        }
        this.lastClickType = 'phone';
        
        this.clickCount++;
        this.resetPatienceTimer();
        this.updateDisplay();
        this.addClickAnimation();
        
        // Check for speed ending (15 clicks in 2 seconds)
        const recentClicks = this.clickTimes.filter(time => now - time <= 2000);
        if (recentClicks.length >= 15) {
            this.endGame('speed');
            return;
        }
        
        // Check for perfect balance (exactly 7 clicks)
        if (this.clickCount === 7) {
            this.startPerfectBalanceTimer();
        }
        
        // Check for secret code
        this.checkSecretCode();
        
        if (this.clickCount >= this.maxClicks) {
            if (this.emojiDumb) {
                this.endGame('sneakysmash');
            } else {
                this.endGame('destruction');
            }
        }
    }

    handleFaceClick() {
        if (this.gameEnded || this.hammerGrabbed) return;
        
        this.playSound('click');
        
        // Reset wait timer
        this.resetWaitTimer();
        
        this.clickSequence.push('face');
        
        // Check for alternating pattern
        if (this.lastClickType === 'phone') {
            this.alternatingCount++;
            if (this.alternatingCount >= 20) {
                this.endGame('alternating');
                return;
            }
        } else if (this.lastClickType === 'face') {
            this.alternatingCount = 0;
        }
        this.lastClickType = 'face';
        
        this.faceClickCount++;
        this.resetPatienceTimer();
        
        // Check for secret code
        this.checkSecretCode();
        
        if (this.faceClickCount >= 15) {
            this.clickCount = -15;
            this.endGame('reverse');
        }
    }

    grabHammer(e) {
        if (this.gameEnded) return;
        
        this.hammerGrabbed = true;
        this.elements.hammer.classList.add('grabbed');
        e.preventDefault();
        this.moveHammer(e);
    }

    moveHammer(e) {
        if (!this.hammerGrabbed) return;
        
        this.elements.hammer.style.left = e.clientX - 20 + 'px';
        this.elements.hammer.style.top = e.clientY - 20 + 'px';
    }

    releaseHammer() {
        if (!this.hammerGrabbed) return;
        
        const hammerRect = this.elements.hammer.getBoundingClientRect();
        const phoneRect = this.elements.phone.getBoundingClientRect();
        const faceRect = this.elements.face.getBoundingClientRect();
        
        // Check if hammer hits phone
        if (this.isColliding(hammerRect, phoneRect)) {
            this.playSound('hammer');
            this.playSound('break');
            this.elements.phone.classList.add('hammer-smashed');
            this.elements.screenCrack.classList.add('visible');
            this.emojiAngry = true;
            this.elements.face.classList.add('angry-hammer');
            this.elements.face.textContent = '😡';
            setTimeout(() => {
                this.endGame('hammersmash');
            }, 1000);
        }
        // Check if hammer hits face
        else if (this.isColliding(hammerRect, faceRect)) {
            this.playSound('hammer');
            this.emojiDumb = true;
            this.elements.face.classList.add('dumb');
            this.elements.face.textContent = '😵';
            this.elements.warningText.textContent = "The emoji is knocked out! It won't notice phone clicks now...";
        }
        
        // Reset hammer position
        this.hammerGrabbed = false;
        this.elements.hammer.classList.remove('grabbed');
        this.elements.hammer.style.left = '';
        this.elements.hammer.style.top = '';
    }

    isColliding(rect1, rect2) {
        return !(rect1.right < rect2.left || 
                rect1.left > rect2.right || 
                rect1.bottom < rect2.top || 
                rect1.top > rect2.bottom);
    }

    playSound(soundType) {
        const audio = new Audio(`${soundType}.mp3`);
        audio.volume = 0.3;
        audio.play().catch(() => {}); // Ignore errors if autoplay is blocked
    }
    
    startPatienceTimer() {
        this.patienceTimer = setTimeout(() => {
            if (!this.gameEnded && this.clickCount === 0) {
                this.endGame('patience');
            }
        }, this.patienceTime);
    }

    resetPatienceTimer() {
        if (this.patienceTimer) {
            clearTimeout(this.patienceTimer);
        }
        if (this.perfectBalanceTimer) {
            clearTimeout(this.perfectBalanceTimer);
        }
        this.startPatienceTimer();
    }
    
    addClickAnimation() {
        this.elements.phone.classList.add('shake');
        setTimeout(() => {
            this.elements.phone.classList.remove('shake');
        }, 500);
    }
    
    updateDisplay() {
        // Update click counter
        this.elements.clickCounter.textContent = this.clickCount;
        
        // Update danger bar
        const dangerPercentage = Math.max(0, (this.clickCount / this.maxClicks) * 100);
        this.elements.dangerBar.style.width = `${dangerPercentage}%`;
        
        // Update emotion face (only if not dumb or angry from hammer)
        if (!this.emojiDumb && !this.emojiAngry) {
            if (this.phonePowered) {
                // Show different emotions when phone is on
                if (this.currentScreen === 'apps') {
                    this.elements.face.textContent = '😎'; // Cool when on home screen
                } else if (this.currentScreen === 'youtube') {
                    this.elements.face.textContent = '😍'; // Star eyes when browsing videos
                } else if (this.currentScreen === 'camera') {
                    this.elements.face.textContent = '😀'; // Grinning when taking photos
                } else if (this.currentScreen === 'phone') {
                    this.elements.face.textContent = '🤔'; // Thinking when making calls
                } else if (this.currentScreen === 'video') {
                    this.elements.face.textContent = '😄'; // Grinning with eyes when watching video
                } else if (this.currentScreen === 'bootup') {
                    this.elements.face.textContent = '😮'; // Surprised when booting up
                } else {
                    this.elements.face.textContent = '😊'; // Default when on
                }
            } else {
                // Original emotion system when phone is off
                const emotionKey = Object.keys(this.emotions)
                    .reverse()
                    .find(key => this.clickCount >= parseInt(key));
                this.elements.face.textContent = this.emotions[emotionKey];
            }
        }
        
        // Update warning text (only if emoji is not dumb)
        if (!this.emojiDumb) {
            if (this.phonePowered) {
                if (this.currentScreen === 'apps') {
                    this.elements.warningText.textContent = "Phone is powered on! Explore the apps!";
                } else if (this.currentScreen === 'youtube') {
                    this.elements.warningText.textContent = "Browsing YouTube videos...";
                } else if (this.currentScreen === 'camera') {
                    this.elements.warningText.textContent = "Taking photos of the emoji!";
                } else if (this.currentScreen === 'phone') {
                    this.elements.warningText.textContent = "Ready to make a call...";
                } else if (this.currentScreen === 'video') {
                    this.elements.warningText.textContent = "Watching video...";
                } else {
                    this.elements.warningText.textContent = "Phone is on!";
                }
            } else {
                const warningKey = Object.keys(this.warnings)
                    .reverse()
                    .find(key => this.clickCount >= parseInt(key));
                this.elements.warningText.textContent = this.warnings[warningKey];
            }
        }
        
        // Add urgency classes
        this.elements.face.className = 'face';
        this.elements.warningText.className = 'warning-text';
        this.elements.phone.className = 'phone';
        
        if (this.clickCount >= 12) {
            this.elements.face.classList.add('angry');
            this.elements.warningText.classList.add('urgent');
            this.elements.phone.classList.add('danger');
        } else if (this.clickCount >= 6) {
            this.elements.face.classList.add('worried');
        }
    }
    
    endGame(endingType) {
        this.gameEnded = true;
        this.achievedEndings.add(endingType);
        
        if (endingType === 'destruction') {
            // Phone broke
            this.playSound('break');
            this.elements.phone.classList.add('broken');
            this.elements.screenCrack.classList.add('visible');
            this.elements.face.textContent = '💀';
            
            setTimeout(() => {
                this.showGameOverScreen(
                    "💥 PHONE DESTROYED! 💥",
                    "Oh no! You clicked the phone too many times and it broke! The phone is now completely unusable. Better luck next time!"
                );
            }, 1000);
        } else if (endingType === 'ksi') {
            this.showGameOverScreen(
                "🎵 KSI KNOCKOUT! 🎵",
                "INCREDIBLE! You forced the emoji to listen to Thick of It! The emoji got so mad it threw the phone to KSI HQ, breaking the window and knocking out KSI himself! The music industry will never be the same!"
            );
        } else if (endingType === 'killstick') {
            this.showGameOverScreen(
                "🔌 KILLSTICK BRICKED! 🔌",
                "You plugged in a USB Killer device! The phone's circuits are completely fried and it's now permanently bricked. The emoji is in complete shock at your technical destruction!"
            );
        } else if (endingType === 'toilet') {
            this.showGameOverScreen(
                "🚽 TOILET EXPLOSION! 🚽",
                "INCREDIBLE! You threw the phone in the toilet and flushed it! The phone spun so fast it clogged the toilet, causing a massive water explosion that launched it 300 feet high, breaking through the roof and shattering on the concrete sidewalk into unrecognizable pieces!"
            );
        } else if (endingType === 'galaxysmash') {
            this.showGameOverScreen(
                "📱 GALAXY S7 DESTRUCTION! 📱",
                "INCREDIBLE! You threw a Samsung Galaxy S7 at the phone causing a massive explosion! The collision was so powerful it shattered both phones into atoms! The emoji is absolutely horrified!"
            );
        } else if (endingType === 'hammersmash') {
            this.showGameOverScreen(
                "🔨 HAMMER SMASH! 🔨",
                "You grabbed the hammer and smashed the phone directly! The emoji is furious at your destructive approach!"
            );
        } else if (endingType === 'sneakysmash') {
            this.playSound('break');
            this.elements.phone.classList.add('broken');
            this.elements.screenCrack.classList.add('visible');
            setTimeout(() => {
                this.showGameOverScreen(
                    "🔨 SNEAKY SMASH! 🔨",
                    "Brilliant! You knocked out the emoji with the hammer, then destroyed the phone without it realizing! Master of deception!"
                );
            }, 1000);
        } else if (endingType === 'heaven') {
            this.elements.phone.classList.add('broken');
            this.elements.screenCrack.classList.add('visible');
            this.elements.face.textContent = '😱';
            this.showGameOverScreen(
                "📱 SEND ME TO HEAVEN! 📱",
                "INCREDIBLE! You threw the phone 250 feet in the air! It exploded into 1 million pieces on impact! The emoji is absolutely terrified!"
            );
        } else if (endingType === 'patience') {
            this.showGameOverScreen(
                "😇 ULTIMATE PATIENCE! 😇",
                "Incredible! You showed ultimate self-control and didn't click anything for 30 seconds. You are the master of patience!"
            );
        } else if (endingType === 'reverse') {
            this.elements.face.textContent = '🔄';
            this.showGameOverScreen(
                "🔄 REVERSE DIMENSION! 🔄",
                "You've entered the reverse dimension! By clicking the face 15 times, you've reversed reality itself. Your score is now -15!"
            );
        } else if (endingType === 'speed') {
            this.elements.face.textContent = '⚡';
            this.showGameOverScreen(
                "⚡ SPEED DEMON! ⚡",
                "Incredible! You clicked 15 times in just 2 seconds! Your fingers move faster than lightning!"
            );
        } else if (endingType === 'alternating') {
            this.elements.face.textContent = '🔄';
            this.showGameOverScreen(
                "🔄 PATTERN MASTER! 🔄",
                "Amazing! You alternated between phone and face clicks perfectly! You've mastered the art of balance!"
            );
        } else if (endingType === 'perfectbalance') {
            this.elements.face.textContent = '⚖️';
            this.showGameOverScreen(
                "⚖️ PERFECT BALANCE! ⚖️",
                "Extraordinary! You clicked exactly 7 times and waited exactly 7 seconds. Perfect harmony achieved!"
            );
        } else if (endingType === 'secretcode') {
            this.elements.face.textContent = '🔐';
            this.showGameOverScreen(
                "🔐 CODE BREAKER! 🔐",
                "You discovered the secret code! Phone-Face-Phone-Face-Phone-Phone-Face. You're a true hacker!"
            );
        } else if (endingType === 'soccerball') {
            this.showGameOverScreen(
                "⚽ SOCCER BALL SMASH! ⚽",
                "INCREDIBLE! You watched Ronaldo score and a soccer ball flew out of the screen and smashed your phone! The power of football is too strong!"
            );
        } else if (endingType === 'cringe') {
            this.showGameOverScreen(
                "🤢 CRINGE DEATH! 🤢",
                "OH NO! The emoji died of cringe from watching the Tralelelo Trallala Shark video and threw the phone away in disgust! Some content is just too cringe to handle!"
            );
        } else if (endingType === 'storage') {
            this.showGameOverScreen(
                "📸 STORAGE EXPLOSION! 📸",
                "You took too many photos and filled up the phone's storage! The phone couldn't handle all the emoji selfies and exploded from memory overload!"
            );
        } else if (endingType === 'phonebill') {
            this.showGameOverScreen(
                "📞 DAD'S REVENGE! 📞",
                "You made too many calls and the phone bill got too high! Dad emoji appeared and confiscated the phone! No more phone privileges for you!"
            );
        }
    }
    
    showGameOverScreen(title, message) {
        this.elements.endingTitle.textContent = title;
        this.elements.endingMessage.textContent = message;
        this.elements.gameOverScreen.classList.add('show');
    }
    
    showEndingsScreen() {
        this.updateEndingsList();
        this.elements.endingsScreen.classList.add('show');
    }
    
    updateEndingsList() {
        const endingItems = document.querySelectorAll('.ending-item');
        const endingTypes = ['destruction', 'patience', 'reverse', 'speed', 'alternating', 'perfectbalance', 'secretcode', 'hammersmash', 'sneakysmash', 'galaxysmash', 'ksi', 'heaven', 'toilet', 'killstick', 'soccerball', 'cringe', 'storage', 'phonebill'];
        
        endingItems.forEach((item, index) => {
            const endingType = endingTypes[index];
            if (endingType && !this.achievedEndings.has(endingType)) {
                item.classList.add('not-achieved');
            } else {
                item.classList.remove('not-achieved');
            }
        });
    }
    
    hideEndingsScreen() {
        this.elements.endingsScreen.classList.remove('show');
    }
    
    resetGame() {
        this.clickCount = 0;
        this.faceClickCount = 0;
        this.gameEnded = false;
        
        // Reset new ending variables
        this.clickTimes = [];
        this.lastClickType = null;
        this.alternatingCount = 0;
        this.clickSequence = [];
        this.lastClickTime = 0;
        
        // Reset phone state
        this.phonePowered = false;
        this.currentScreen = 'off';
        this.photoCount = 0;
        this.phoneNumber = '';
        this.elements.photoCount.textContent = '0';
        this.elements.phoneNumberDisplay.textContent = '';
        this.elements.captureButton.disabled = false;
        this.elements.captureButton.textContent = '📸';
        this.hideAllScreens();
        
        // Reset hammer variables
        this.hammerGrabbed = false;
        this.emojiDumb = false;
        this.emojiAngry = false;
        
        // Reset wait timer
        this.resetWaitTimer();
        
        if (this.patienceTimer) {
            clearTimeout(this.patienceTimer);
        }
        if (this.perfectBalanceTimer) {
            clearTimeout(this.perfectBalanceTimer);
        }
        
        // Reset all visual elements
        this.elements.phone.className = 'phone';
        this.elements.screenCrack.classList.remove('visible');
        this.elements.face.className = 'face';
        this.elements.warningText.className = 'warning-text';
        this.elements.gameOverScreen.classList.remove('show');
        this.elements.endingsScreen.classList.remove('show');
        this.elements.achievementsScreen.classList.remove('show');
        this.elements.heavenScreen.classList.remove('show');
        this.elements.toiletScreen.classList.remove('show');
        this.elements.ksiScreen.classList.remove('show');
        this.elements.ksiHqScreen.classList.remove('show');
        this.elements.hammer.classList.remove('grabbed');
        this.elements.hammer.style.left = '';
        this.elements.hammer.style.top = '';
        this.elements.galaxyS7.className = 'galaxy-s7';
        this.elements.galaxyS7.style.display = 'none';
        this.elements.toiletPhone.className = 'toilet-phone';
        this.elements.flushButton.disabled = false;
        this.elements.angryEmoji.className = 'angry-emoji';
        this.elements.angryEmoji.textContent = '😡';
        this.elements.flyingPhone.className = 'flying-phone';
        this.elements.ksiPerson.classList.remove('knocked-out');
        
        this.startPatienceTimer();
        this.updateDisplay();
    }
    
    startPerfectBalanceTimer() {
        this.perfectBalanceTimer = setTimeout(() => {
            if (this.clickCount === 7 && !this.gameEnded) {
                this.endGame('perfectbalance');
            }
        }, 7000); // exactly 7 seconds
    }
    
    checkSecretCode() {
        const sequence = this.clickSequence.slice(-7); // last 7 clicks
        const secretCode = ['phone', 'face', 'phone', 'face', 'phone', 'phone', 'face'];
        
        if (sequence.length === 7 && 
            sequence.every((click, index) => click === secretCode[index])) {
            this.endGame('secretcode');
        }
    }
    
    showHeavenScreen() {
        this.elements.heavenScreen.classList.add('show');
    }
    
    startThrowingGame() {
        const heavenPhone = document.querySelector('.heaven-phone');
        const heavenScreen = this.elements.heavenScreen;
        
        // Start throwing animation
        heavenPhone.classList.add('throwing');
        this.elements.face.textContent = '😱';
        this.elements.face.classList.add('angry');
        
        // After 2 seconds, show explosion
        setTimeout(() => {
            heavenPhone.classList.remove('throwing');
            heavenPhone.classList.add('exploding');
            this.playSound('break');
            
            // Hide heaven screen and show ending after explosion
            setTimeout(() => {
                heavenScreen.classList.remove('show');
                heavenPhone.classList.remove('exploding');
                this.endGame('heaven');
            }, 1000);
        }, 2000);
    }
    
    throwGalaxyS7() {
        if (this.gameEnded) return;
        
        const galaxyS7 = this.elements.galaxyS7;
        const phone = this.elements.phone;
        const face = this.elements.face;
        
        // Start throwing animation
        galaxyS7.classList.add('throwing');
        face.textContent = '😱';
        face.classList.add('angry');
        
        // After 2 seconds, collision and explosion
        setTimeout(() => {
            galaxyS7.classList.remove('throwing');
            galaxyS7.classList.add('exploding');
            phone.classList.add('galaxy-exploded');
            this.elements.screenCrack.classList.add('visible');
            
            // Play explosion sounds
            this.playSound('break');
            this.playSound('hammer');
            
            // End explosion animation and show ending
            setTimeout(() => {
                galaxyS7.classList.remove('exploding');
                galaxyS7.style.display = 'none';
                this.endGame('galaxysmash');
            }, 1500);
        }, 2000);
    }

    plugKillstick() {
        if (this.gameEnded) return;
        
        this.elements.phone.classList.add('bricked');
        this.elements.face.textContent = '😱';
        this.elements.face.classList.add('angry');
        this.elements.warningText.textContent = "USB KILLER DETECTED! PHONE CIRCUITS FRYING!";
        
        setTimeout(() => {
            this.endGame('killstick');
        }, 2000);
    }

    showToiletScreen() {
        this.elements.toiletScreen.classList.add('show');
        this.elements.toiletPhone.classList.add('dropped');
        this.elements.face.textContent = '😱';
        this.elements.face.classList.add('angry');
    }

    flushToilet() {
        if (this.gameEnded) return;
        
        this.elements.flushButton.disabled = true;
        this.elements.toiletPhone.classList.add('flushing');
        this.playSound('flush');
        
        setTimeout(() => {
            this.elements.toiletPhone.classList.add('exploding');
            this.playSound('break');
            this.playSound('hammer');
            
            setTimeout(() => {
                this.elements.toiletScreen.classList.remove('show');
                this.elements.phone.classList.add('broken');
                this.elements.screenCrack.classList.add('visible');
                this.endGame('toilet');
            }, 3000);
        }, 2000);
    }

    forceListenKSI() {
        if (this.gameEnded) return;
        
        this.elements.ksiScreen.classList.add('show');
        this.elements.face.textContent = '😐';
        
        // Play KSI song
        const ksiAudio = new Audio('KSI - Thick Of It (feat. Trippie Redd) [Official Music Video].mp3');
        ksiAudio.volume = 0.5;
        ksiAudio.play().catch(() => {});
        
        // After 3 seconds, emoji gets mad
        setTimeout(() => {
            this.elements.face.textContent = '😡';
            this.elements.face.classList.add('angry');
            this.elements.angryEmoji.classList.add('grabbing');
            this.elements.angryEmoji.textContent = '✊';
            
            // Stop music and throw phone
            ksiAudio.pause();
            ksiAudio.currentTime = 0;
            
            setTimeout(() => {
                this.elements.ksiScreen.classList.remove('show');
                this.elements.ksiHqScreen.classList.add('show');
                this.elements.flyingPhone.classList.add('flying');
                
                // Phone breaks window and hits KSI
                setTimeout(() => {
                    this.elements.flyingPhone.classList.add('impact');
                    this.elements.ksiPerson.classList.add('knocked-out');
                    this.playSound('break');
                    this.playSound('knockout');
                    
                    setTimeout(() => {
                        this.elements.ksiHqScreen.classList.remove('show');
                        this.elements.phone.classList.add('broken');
                        this.elements.screenCrack.classList.add('visible');
                        this.endGame('ksi');
                    }, 2000);
                }, 1500);
            }, 1000);
        }, 3000);
    }
    
    startWaitTimer() {
        this.waitStartTime = Date.now();
    }
    
    resetWaitTimer() {
        if (this.waitStartTime) {
            const waitTime = Date.now() - this.waitStartTime;
            if (waitTime > this.stats.maxWaitTime) {
                this.stats.maxWaitTime = waitTime;
                this.saveAchievements();
                
                // Check wait achievements
                this.checkAchievement('wait_1min');
                this.checkAchievement('wait_5min');
                this.checkAchievement('wait_10min');
                this.checkAchievement('wait_30min');
                this.checkAchievement('wait_1hour');
            }
        }
        this.startWaitTimer();
    }
    
    checkAchievement(achievementId) {
        if (this.achievedAchievements.has(achievementId)) return;
        
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (achievement && achievement.condition()) {
            this.achievedAchievements.add(achievementId);
            this.saveAchievements();
            this.showAchievementNotification(achievement);
        }
    }
    
    showAchievementNotification(achievement) {
        const notification = this.elements.achievementNotification;
        const title = document.getElementById('achievementTitle');
        const description = document.getElementById('achievementDescription');
        const points = document.getElementById('achievementPoints');
        const icon = notification.querySelector('.achievement-icon');
        
        title.textContent = achievement.title;
        description.textContent = achievement.description;
        points.textContent = achievement.points;
        icon.textContent = achievement.icon;
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.add('slide-out');
            setTimeout(() => {
                notification.classList.remove('show', 'slide-out');
            }, 500);
        }, 4000);
    }
    
    showAchievementsScreen() {
        this.updateAchievementsList();
        this.elements.achievementsScreen.classList.add('show');
    }
    
    hideAchievementsScreen() {
        this.elements.achievementsScreen.classList.remove('show');
    }
    
    updateAchievementsList() {
        const list = document.getElementById('achievementsList');
        list.innerHTML = '';
        
        this.achievements.forEach(achievement => {
            const item = document.createElement('div');
            const isUnlocked = this.achievedAchievements.has(achievement.id);
            
            item.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;
            
            let progressText = '';
            if (!isUnlocked) {
                // Show progress for certain achievements
                if (achievement.id.startsWith('click_')) {
                    const target = parseInt(achievement.id.split('_')[1]);
                    progressText = `<div class="achievement-item-progress">${this.stats.totalClicks}/${target}</div>`;
                } else if (achievement.id.startsWith('boot_')) {
                    const target = parseInt(achievement.id.split('_')[1]);
                    progressText = `<div class="achievement-item-progress">${this.stats.bootCount}/${target}</div>`;
                } else if (achievement.id.startsWith('wait_')) {
                    const currentWaitMinutes = Math.floor(this.stats.maxWaitTime / 60000);
                    let targetMinutes;
                    if (achievement.id === 'wait_1min') targetMinutes = 1;
                    else if (achievement.id === 'wait_5min') targetMinutes = 5;
                    else if (achievement.id === 'wait_10min') targetMinutes = 10;
                    else if (achievement.id === 'wait_30min') targetMinutes = 30;
                    else if (achievement.id === 'wait_1hour') targetMinutes = 60;
                    
                    if (targetMinutes) {
                        progressText = `<div class="achievement-item-progress">${currentWaitMinutes}/${targetMinutes} min</div>`;
                    }
                }
            }
            
            item.innerHTML = `
                <div class="achievement-item-icon">${achievement.icon}</div>
                <div class="achievement-item-content">
                    <div class="achievement-item-title">${achievement.title}</div>
                    <div class="achievement-item-description">${achievement.description}</div>
                </div>
                <div class="achievement-item-points">${achievement.points}</div>
                ${progressText}
            `;
            
            list.appendChild(item);
        });
    }
    
    loadAchievements() {
        const saved = localStorage.getItem('phoneGameAchievements');
        if (saved) {
            const data = JSON.parse(saved);
            this.achievedAchievements = new Set(data.achievements || []);
            this.stats = { ...this.stats, ...data.stats };
        }
    }
    
    saveAchievements() {
        localStorage.setItem('phoneGameAchievements', JSON.stringify({
            achievements: Array.from(this.achievedAchievements),
            stats: this.stats
        }));
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DontBreakThePhoneGame();
});