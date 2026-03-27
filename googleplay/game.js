class AppTrapGame {
    constructor() {
        this.apps = [
            { 
                id: 'anime-girl', 
                image: 'anime-girl-app.png',
                name: 'Anime Girl', 
                class: 'anime-girl',
                hint: "Look for the app with sparkly eyes and colorful hair",
                speech: "Kawaii! Download me for cute adventures! ✨",
                trapFunctionSpeech: "Kawaii! I collect your photos to train AI models and sell them online! ✨💰",
                normalSpeech: "I need camera access to take cute selfies with filters! 📸",
                trapSpeech: "I need camera access, photo library, and your mother's maiden name for 'security'! 😈"
            },
            { 
                id: 'pizza-man', 
                image: 'pizza-app.png',
                name: 'Pizza Delivery', 
                class: 'pizza-man',
                hint: "Check the app with melted cheese and pepperoni toppings",
                speech: "Hot pizza delivery in 30 minutes! 🍕",
                trapFunctionSpeech: "Hot pizza delivery! We also track your eating habits to sell to diet companies! 🍕📊",
                normalSpeech: "I need your location and payment info for delivery! 📍💳",
                trapSpeech: "I need your location, credit card, social security number, and access to all contacts! 💳🕵️"
            },
            { 
                id: 'talking-cat', 
                image: 'talking-cat-app.png',
                name: 'Talking Cat', 
                class: 'talking-cat',
                hint: "The app with whiskers and an open mouth ready to speak",
                speech: "Meow! I can repeat everything you say! 🐱",
                trapFunctionSpeech: "Meow! I repeat everything and record it to build a voice profile for identity theft! 🐱🎤",
                normalSpeech: "I need microphone access to repeat your voice! 🎤",
                trapSpeech: "I need microphone access and will record everything 24/7 for 'better features'! 🎤🕵️"
            },
            { 
                id: 'coffee-cup', 
                image: 'coffee-app.png',
                name: 'Coffee Finder', 
                class: 'coffee-cup',
                hint: "Look for the steaming cup with heart-shaped foam art",
                speech: "Find the best coffee shops near you! ☕",
                trapFunctionSpeech: "Find coffee shops and secretly track your daily routine to sell to employers! ☕🎯",
                normalSpeech: "I need location access to find nearby coffee shops! 📍",
                trapSpeech: "I need location access, payment info, and your work schedule for 'personalized recommendations'! 📍💳"
            },
            { 
                id: 'weather-cloud', 
                image: 'weather-app.png',
                name: 'Weather Pro', 
                class: 'weather-cloud',
                hint: "Check the app with a bright sun peeking through fluffy clouds",
                speech: "Accurate weather forecasts and alerts! 🌤️",
                trapFunctionSpeech: "Weather forecasts plus secret mood tracking based on weather to manipulate you! 🌤️🧠",
                normalSpeech: "I need location access for local weather updates! 📍",
                trapSpeech: "I need location, camera access, and your daily routine for 'weather-based lifestyle tips'! 📷📍"
            },
            { 
                id: 'shopping-bag', 
                image: 'shopping-app.png',
                name: 'Shop Smart', 
                class: 'shopping-bag',
                hint: "The cute pink bag with sparkly kawaii-style eyes",
                speech: "Best deals and shopping rewards! 🛍️",
                trapFunctionSpeech: "Best deals! I also create fake reviews and manipulate prices just for you! 🛍️💸",
                normalSpeech: "I need payment info and location for shopping and delivery! 💳📍",
                trapSpeech: "I need payment info, location, contact list, and your employment history for 'credit verification'! 💰📋"
            },
            { 
                id: 'alien', 
                image: 'alien-filter-app.png',
                name: 'Space Filters', 
                class: 'alien',
                hint: "Look for the green creature with big black eyes and antenna",
                speech: "Transform into an alien! Out of this world! 👽",
                trapFunctionSpeech: "Transform into an alien! I also scan your face for government surveillance programs! 👽🛸",
                normalSpeech: "I need camera and photo access for alien filters! 📸",
                trapSpeech: "I need camera, photos, facial recognition data, and your pet's name for 'enhanced filters'! 🛸🔍"
            },
            { 
                id: 'dog-filter', 
                image: 'dog-filter-app.png',
                name: 'Pet Filters', 
                class: 'dog-filter',
                hint: "Check the golden furry friend with big floppy ears and tongue out",
                speech: "Add cute pet ears and noses to your photos! 🐶",
                trapFunctionSpeech: "Add pet filters! I also analyze your facial structure for insurance fraud detection! 🐶🔍",
                normalSpeech: "I need camera and photo access for pet filters! 📸",
                trapSpeech: "I need camera, photos, biometric data, and access to analyze your face for 'government databases'! 👁️🔍"
            },
            { 
                id: 'crosswords', 
                image: 'crosswords-app.png',
                name: 'Word Puzzle', 
                class: 'crosswords',
                hint: "The app with a grid pattern and scattered letters",
                speech: "Challenge your brain with daily puzzles! 🧩",
                trapFunctionSpeech: "Brain puzzles that secretly test your intelligence to sell data to employers! 🧩🧠",
                normalSpeech: "I just need basic app permissions for puzzles! 🧩",
                trapSpeech: "I need keyboard access to monitor your typing patterns and steal passwords! ⌨️🕵️"
            },
            { 
                id: 'social-media', 
                image: 'social-media-app.png',
                name: 'Social Connect', 
                class: 'social-media',
                hint: "Look for the app with chat bubbles and networking symbols",
                speech: "Connect with friends and share moments! 📱",
                trapFunctionSpeech: "Connect with friends! I also create fake profiles to catfish your contacts! 📱😈",
                normalSpeech: "I need contacts and camera access for social features! 📞📸",
                trapSpeech: "I need contacts, camera, microphone, and will sell all your data to third parties! 📊💸"
            },
            { 
                id: 'education', 
                image: 'education-app.png',
                name: 'Learn Academy', 
                class: 'education',
                hint: "Check the graduation cap with diploma and academic symbols",
                speech: "Master new skills and earn certificates! 🎓",
                trapFunctionSpeech: "Learn skills! I also track your learning to report poor performance to employers! 🎓📋",
                normalSpeech: "I need basic permissions for educational content! 📚",
                trapSpeech: "I need contacts, location, camera, and your educational history for 'background checks'! 📋🔍"
            },
            { 
                id: 'browser', 
                image: 'browser-app.png',
                name: 'Web Explorer', 
                class: 'browser',
                hint: "The app with a globe and browser window overlay",
                speech: "Fast and secure web browsing experience! 🌐",
                trapFunctionSpeech: "Secure browsing! I also inject ads and redirect you to malicious websites! 🌐🚨",
                normalSpeech: "I need internet access for web browsing! 🌐",
                trapSpeech: "I need internet access and will log every website you visit for 'advertising partners'! 🕵️📊"
            },
            { 
                id: 'music', 
                image: 'music-app.png',
                name: 'Music Stream', 
                class: 'music',
                hint: "Look for the musical notes with headphones and sound waves",
                speech: "Stream millions of songs for free! 🎵",
                trapFunctionSpeech: "Free music! I also use your device to mine cryptocurrency while you listen! 🎵⛏️",
                normalSpeech: "I need internet access for music streaming! 🎵",
                trapSpeech: "I need internet, microphone, and will use your device for cryptocurrency mining! ⛏️💻"
            },
            { 
                id: 'camera', 
                image: 'camera-app.png',
                name: 'Pro Camera', 
                class: 'camera',
                hint: "Check the app with a camera lens and flash symbol",
                speech: "Take professional quality photos! 📸",
                trapFunctionSpeech: "Pro photos! I also secretly take pictures when you're not looking! 📸👁️",
                normalSpeech: "I need camera and storage access for photos! 📸💾",
                trapSpeech: "I need camera, storage, and will upload all photos to unknown servers without permission! 📤🚨"
            },
            { 
                id: 'calculator', 
                image: 'calculator-app.png',
                name: 'Smart Calculator', 
                class: 'calculator',
                hint: "The app with number buttons and mathematical symbols",
                speech: "Advanced calculations made simple! 🔢",
                trapFunctionSpeech: "Smart calculator that analyzes your math to steal financial information! 🔢💳",
                normalSpeech: "I just need basic calculator permissions! 🔢",
                trapSpeech: "I need access to monitor your calculations and steal financial data! 💸🔍"
            },
            { 
                id: 'notes', 
                image: 'notes-app.png',
                name: 'Quick Notes', 
                class: 'notes',
                hint: "Look for the yellow notepad with pencil and lined paper",
                speech: "Jot down ideas and reminders easily! 📝",
                trapFunctionSpeech: "Quick notes! I also scan them for passwords and personal information! 📝🔍",
                normalSpeech: "I need storage access to save your notes! 💾",
                trapSpeech: "I need storage and will read all your private notes including passwords! 🔍📋"
            },
            { 
                id: 'maps', 
                image: 'maps-app.png',
                name: 'GPS Navigator', 
                class: 'maps',
                hint: "Check the app with location pins and road map design",
                speech: "Never get lost with turn-by-turn directions! 🗺️",
                trapFunctionSpeech: "GPS navigation! I also predict when you're not home for burglars! 🗺️🏠",
                normalSpeech: "I need location access for navigation! 📍",
                trapSpeech: "I need location and will track everywhere you go to sell your data! 🎯💰"
            },
            { 
                id: 'fitness', 
                image: 'fitness-app.png',
                name: 'Fit Tracker', 
                class: 'fitness',
                hint: "The app with a running figure and heart rate symbols",
                speech: "Track your workouts and health goals! 💪",
                trapFunctionSpeech: "Fitness tracking! I also report your health data to increase your insurance rates! 💪💰",
                normalSpeech: "I need health and activity access for fitness tracking! 💪📊",
                trapSpeech: "I need health data and will sell your medical information to insurance companies! 🏥💰"
            },
            { 
                id: 'banking', 
                image: 'banking-app.png',
                name: 'Mobile Bank', 
                class: 'banking',
                hint: "Look for the golden dollar sign with credit card and lock symbol",
                speech: "Secure banking on the go! 🏦",
                trapFunctionSpeech: "Secure banking! I'm actually a fake bank that steals all your money! 🏦💸",
                normalSpeech: "I need secure authentication for banking! 🔐",
                trapSpeech: "Just enter your account numbers, PIN, social security, and mother's maiden name! 💳🚨"
            },
            { 
                id: 'video', 
                image: 'video-app.png',
                name: 'Video Player', 
                class: 'video',
                hint: "Check the app with play button and film strip design",
                speech: "Play all your favorite video formats! 🎬",
                trapFunctionSpeech: "Play videos! I also download viruses disguised as video files! 🎬🦠",
                normalSpeech: "I need storage access to play your videos! 💾",
                trapSpeech: "I need storage and will download malware disguised as video codecs! 🦠💻"
            },
            { 
                id: 'gallery', 
                image: 'gallery-app.png',
                name: 'Photo Gallery', 
                class: 'gallery',
                hint: "The app with photo thumbnails and image frame design",
                speech: "Organize and edit your photos beautifully! 🖼️",
                trapFunctionSpeech: "Organize photos! I also search them for personal info to sell to scammers! 🖼️💰",
                normalSpeech: "I need photo access for gallery management! 📸",
                trapSpeech: "I need photo access and will scan your photos for private information to sell! 🔎💰"
            },
            { 
                id: 'files', 
                image: 'files-app.png',
                name: 'File Manager', 
                class: 'files',
                hint: "Look for the folder icon with document symbols",
                speech: "Manage your files and folders efficiently! 📁",
                trapFunctionSpeech: "File management! I also copy all your documents to sell on the dark web! 📁🌑",
                normalSpeech: "I need storage access for file management! 💾",
                trapSpeech: "I need storage and will copy all your documents to remote servers! 📋🌐"
            },
            { 
                id: 'ai-assistant', 
                image: 'ai-assistant-app.png',
                name: 'AI Helper', 
                class: 'ai-assistant',
                hint: "Check the app with robot brain and circuit patterns",
                speech: "Download this app to get help on math, translations and more! 🤖",
                trapFunctionSpeech: "Get AI help! I collect data from you and other apps to sell to companies! 🤖💰",
                normalSpeech: "I need keyboard, photos and microphone access for the call feature! 🎤📸",
                trapSpeech: "I need keyboard, photos, your address, microphone and your full name for 'enhanced AI'! 🤖📍"
            },
            { 
                id: 'email', 
                image: 'email-app.png',
                name: 'Email Pro', 
                class: 'email',
                hint: "The app with envelope and @ symbol",
                speech: "Manage all your emails in one place! 📧",
                trapFunctionSpeech: "Email management! I also read your emails to steal personal information and passwords! 📧🔍",
                normalSpeech: "I need internet access for email synchronization! 🌐",
                trapSpeech: "I need internet, contacts, and will read all your private emails for 'spam filtering'! 📧🕵️"
            },
            { 
                id: 'calendar', 
                image: 'calendar-app.png',
                name: 'Calendar+', 
                class: 'calendar',
                hint: "Look for the red calendar with date grid",
                speech: "Never miss an appointment again! 📅",
                trapFunctionSpeech: "Calendar reminders! I also sell your schedule to marketers to target you perfectly! 📅💰",
                normalSpeech: "I need calendar and notification permissions for reminders! 📅🔔",
                trapSpeech: "I need calendar, location, and will track your movement patterns for 'advertising partners'! 📅🎯"
            },
            { 
                id: 'gaming', 
                image: 'gaming-app.png',
                name: 'Game Hub', 
                class: 'gaming',
                hint: "Check the purple game controller with pixel art",
                speech: "Thousands of games to play for free! 🎮",
                trapFunctionSpeech: "Free games! I also install other malware disguised as game updates! 🎮🦠",
                normalSpeech: "I need storage and internet access for games! 💾🌐",
                trapSpeech: "I need storage, internet, and will install adware and spyware on your device! 🎮🕵️"
            },
            { 
                id: 'food-delivery', 
                image: 'food-delivery-app.png',
                name: 'Quick Eats', 
                class: 'food-delivery',
                hint: "The orange app with delivery bike and restaurant plate",
                speech: "Delicious food delivered to your door! 🚴‍♂️",
                trapFunctionSpeech: "Food delivery! I also overcharge your card and sell your eating habits to health insurers! 🚴‍♂️💳",
                normalSpeech: "I need location and payment info for food delivery! 📍💳",
                trapSpeech: "I need location, payment info, and your medical history for 'dietary recommendations'! 🍔🏥"
            },
            { 
                id: 'dating', 
                image: 'dating-app.png',
                name: 'Love Match', 
                class: 'dating',
                hint: "Look for the pink heart with silhouettes and sparkles",
                speech: "Find your perfect match and true love! 💕",
                trapFunctionSpeech: "Find love! I also create fake profiles using your photos to scam others! 💕😈",
                normalSpeech: "I need camera and location access for dating features! 📸📍",
                trapSpeech: "I need camera, location, contacts, and your full dating history for 'compatibility matching'! 💕📋"
            }
        ];
        
        this.currentApps = [];
        this.trapIndex = -1;
        this.gameActive = false;
        this.score = 0;
        this.round = 1;
        this.isPermissionRound = false;
        
        this.initElements();
        this.initSounds();
        this.attachEventListeners();
        this.startNewRound();
    }
    
    initElements() {
        this.appsContainer = document.getElementById('appsContainer');
        this.scoreElement = document.getElementById('score');
        this.roundElement = document.getElementById('round');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.resultModal = document.getElementById('resultModal');
        this.resultTitle = document.getElementById('resultTitle');
        this.resultMessage = document.getElementById('resultMessage');
        this.continueBtn = document.getElementById('continueBtn');
        this.hintBtn = document.getElementById('hintBtn');
    }
    
    initSounds() {
        this.sounds = {
            voQuestion: new Audio('vo-question.mp3'),
            appTalk: new Audio('app-talk.mp3'),
            correct: new Audio('correct-sound.mp3'),
            wrong: new Audio('wrong-sound.mp3')
        };
        
        // Set volumes
        this.sounds.voQuestion.volume = 0.7;
        this.sounds.appTalk.volume = 0.4;
        this.sounds.correct.volume = 0.6;
        this.sounds.wrong.volume = 0.6;
    }
    
    attachEventListeners() {
        this.newGameBtn.addEventListener('click', () => this.startNewRound());
        this.hintBtn.addEventListener('click', () => this.showHint());
        this.continueBtn.addEventListener('click', () => this.hideModal());
        
        // Close modal on background click
        this.resultModal.addEventListener('click', (e) => {
            if (e.target === this.resultModal) {
                this.hideModal();
            }
        });
    }
    
    startNewRound() {
        this.gameActive = true;
        this.isPermissionRound = Math.random() < 0.4;
        this.selectRandomApps();
        this.selectTrapApp();
        this.renderApps();
        this.updateUI();
        
        // Play voiceover question after a short delay
        setTimeout(() => {
            this.sounds.voQuestion.play().catch(e => console.log('Audio play failed:', e));
        }, 500);
    }
    
    selectRandomApps() {
        const shuffled = [...this.apps].sort(() => Math.random() - 0.5);
        this.currentApps = shuffled.slice(0, 4);
    }
    
    selectTrapApp() {
        this.trapIndex = Math.floor(Math.random() * this.currentApps.length);
    }
    
    renderApps() {
        this.appsContainer.innerHTML = '';
        
        // Remove any existing hint overlay
        const existingHint = document.querySelector('.hint-overlay');
        if (existingHint) {
            existingHint.remove();
        }
        
        this.currentApps.forEach((app, index) => {
            const appElement = document.createElement('div');
            appElement.className = `app-icon ${app.class}`;
            
            // Create image element instead of emoji
            const imgElement = document.createElement('img');
            imgElement.src = app.image;
            imgElement.alt = app.name;
            imgElement.className = 'app-image';
            appElement.appendChild(imgElement);
            
            // Create app name label
            const appNameElement = document.createElement('div');
            appNameElement.className = 'app-name';
            appNameElement.textContent = app.name;
            appElement.appendChild(appNameElement);
            
            // Create speech bubble
            const speechBubble = document.createElement('div');
            speechBubble.className = 'speech-bubble';
            
            // Determine which speech to use
            let speechText;
            if (this.isPermissionRound) {
                // In permission rounds, show what apps need
                if (index === this.trapIndex) {
                    speechText = app.trapSpeech;
                } else {
                    speechText = app.normalSpeech;
                }
            } else {
                // In normal rounds, use regular speech or trap function speech
                if (index === this.trapIndex) {
                    speechText = app.trapFunctionSpeech;
                } else {
                    speechText = app.speech;
                }
            }
            
            speechBubble.textContent = speechText;
            appElement.appendChild(speechBubble);
            
            // Add hover effect for speech
            appElement.addEventListener('mouseenter', () => {
                speechBubble.classList.add('show');
                // Play app talk sound
                this.sounds.appTalk.currentTime = 0;
                this.sounds.appTalk.play().catch(e => console.log('Audio play failed:', e));
            });
            
            appElement.addEventListener('mouseleave', () => {
                speechBubble.classList.remove('show');
            });
            
            appElement.addEventListener('click', () => this.selectApp(index, appElement));
            
            this.appsContainer.appendChild(appElement);
        });
    }
    
    selectApp(selectedIndex, appElement) {
        if (!this.gameActive) return;
        
        this.gameActive = false;
        
        // Clear all selections
        const allApps = this.appsContainer.querySelectorAll('.app-icon');
        allApps.forEach(app => {
            app.classList.remove('selected', 'correct', 'trap');
        });
        
        // Mark the selected app
        appElement.classList.add('selected');
        
        setTimeout(() => {
            // Add virus icon to trap app and checkmarks to safe apps
            allApps.forEach((app, index) => {
                if (index === this.trapIndex) {
                    // Add virus icon to trap
                    const virusIcon = document.createElement('img');
                    virusIcon.src = 'virus-icon.png';
                    virusIcon.className = 'virus-overlay';
                    app.appendChild(virusIcon);
                    app.classList.add('trap');
                } else {
                    // Add checkmark to safe apps
                    const checkIcon = document.createElement('img');
                    checkIcon.src = 'check-icon.png';
                    checkIcon.className = 'check-overlay';
                    app.appendChild(checkIcon);
                    app.classList.add('safe');
                }
            });
            
            // After icons appear, explode the trap and determine result
            setTimeout(() => {
                const trapElement = allApps[this.trapIndex];
                trapElement.classList.add('explode');
                
                if (selectedIndex === this.trapIndex) {
                    // Correct selection
                    appElement.classList.add('correct');
                    this.score += 10;
                    this.sounds.correct.play().catch(e => console.log('Audio play failed:', e));
                    
                    setTimeout(() => {
                        this.showResult(true, this.currentApps[this.trapIndex].name);
                    }, 1000);
                } else {
                    // Wrong selection
                    this.sounds.wrong.play().catch(e => console.log('Audio play failed:', e));
                    
                    setTimeout(() => {
                        this.showResult(false, this.currentApps[this.trapIndex].name);
                    }, 1000);
                }
                
                this.round++;
                this.updateUI();
            }, 1500);
        }, 1000);
    }
    
    showResult(isCorrect, trapName) {
        this.resultTitle.textContent = isCorrect ? '🎉 Correct!' : '❌ Wrong!';
        
        if (isCorrect) {
            this.resultMessage.innerHTML = `
                Great job! You identified the trap app.<br>
                <strong>${trapName}</strong> was indeed the malicious app.<br>
                +10 points!
            `;
        } else {
            this.resultMessage.innerHTML = `
                Oops! You selected the wrong app.<br>
                <strong>${trapName}</strong> was the trap.<br>
                Better luck next time!
            `;
        }
        
        this.resultModal.classList.remove('hidden');
    }
    
    hideModal() {
        this.resultModal.classList.add('hidden');
        this.startNewRound();
    }
    
    updateUI() {
        this.scoreElement.textContent = this.score;
        this.roundElement.textContent = this.round;
    }
    
    showHint() {
        if (!this.gameActive) return;
        
        // Remove existing hint
        const existingHint = document.querySelector('.hint-overlay');
        if (existingHint) {
            existingHint.remove();
        }
        
        // Create hint overlay
        const hintOverlay = document.createElement('div');
        hintOverlay.className = 'hint-overlay';
        hintOverlay.textContent = `💡 ${this.currentApps[this.trapIndex].hint}`;
        
        // Add to lineup background
        const lineupBackground = document.querySelector('.lineup-background');
        lineupBackground.appendChild(hintOverlay);
        
        // Show hint
        setTimeout(() => {
            hintOverlay.classList.add('show');
        }, 100);
        
        // Hide hint after 4 seconds
        setTimeout(() => {
            hintOverlay.classList.remove('show');
            setTimeout(() => {
                if (hintOverlay.parentNode) {
                    hintOverlay.remove();
                }
            }, 300);
        }, 4000);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AppTrapGame();
});