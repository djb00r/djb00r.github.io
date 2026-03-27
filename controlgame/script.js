// Move global variables to top
let score = 0;
let gameActive = false;
let player = {
    x: 0,
    y: 0,
    width: 30,
    height: 20,
    speed: 5,
    health: 100,
    lastShot: 0
};
let bullets = [];
let enemies = [];
let stars = [];
let keys = {};
let lastEnemySpawnTime = 0;
let canvas, ctx;
let potions = [];
let healthFood = [];
let captionsOn = false;
let captionInterval;
let likeCount = 24;
let dislikeCount = 3;
let commentCount = 8;
let adPlaying = false;
let adTimer = null;
let nextAdTime = Math.random() * (30 - 16) + 16; // Random time between 16-30 seconds
let commentTimer = null;
let nextCommentTime = Math.floor(Math.random() * 54) + 6; // Random time between 7-60 seconds
let starPowerActive = false;
let starPowerTimeout = null;
let originalSpeed = player.speed;
let originalHealth = player.health;
let subscriberCount = 0;
const BANNED_WORDS = [
    'bad', 'inappropriate', 'offensive', 'vore', 'nsfw',
    'fuck', 'fck', 'fuk', 'sh!t', 'shit', 'sht',
    'ass', '@ss', 'a$$', 'damn', 'd@mn',
    'bitch', 'b!tch', 'btch',
    'crap', 'cr@p',
    'piss', 'p!ss',
    "Artificial Intelligence (2022)",
    "Gaming Community (2022)",
    "Game Reviews (2022)",
    "Gaming News (2022)"
];

const videoTitles = [
    "Top 10 Flash Games 2008!!!",
    "How to Make a Flash Game Tutorial",
    "Best Space Games Compilation",
    "HIGH SCORE Record Gameplay!",
    "Rick Astley - Never Gonna Give You Up",
    "CountryBalls Live Episode #12",
    "Ultimate Space Shooter Guide",
    "Keyin Plays: Space Invaders",
    "Learn Flash Animation in 10 min",
    "Gaming Nostalgia 2000s Compilation",
    "Top 20 Browser Games (NO DOWNLOAD)",
    "Amazing MS Paint Art Tutorial"
];
    
const channelNames = [
    "GameReviewer", "FlashTutorials", "GameMaster99",
    "RetroGaming", "MusicVEVO", "CountryBallsTV",
    "GamerGuides", "KeyinGames", "FlashExperts",
    "YesterdaysInternet", "BrowserGames", "MSPaintArtist"
];
    
const viewCounts = [
    "215K", "87K", "432K", "65K", "4.2M", "328K",
    "112K", "765K", "924K", "162K", "578K", "245K"
];
    
const durations = [
    "2:45", "7:18", "4:32", "5:20", "3:32", "6:15",
    "8:42", "11:05", "10:00", "15:21", "12:36", "9:18"
];

const customThumbnails = [
    '/Screenshot 2025-03-04 213238.png',
    '/unnamed (3).webp',
    '/60420785_3111111111111111111111111111111112x311111111111111111111111111112.png',
    '/a/a1b5319e-c56c-40ef-90eb-133d2bd10f0a'
];
    
const quarterThumbnails = [
    '/Screenshot 2025-03-04 213238.png',
    '/Screenshot 2025-03-08 104458.png'
];

let hasQuarter = false;

let isMobile = false;
let joystick = null;

let controller = null;
let hasGamepad = false;
let controllerInterval = null;

document.addEventListener('DOMContentLoaded', function() {
    // Get canvas first
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    
    const audio = document.getElementById('background-audio');
    const playPauseBtn = document.querySelector('.play-pause');
    const bufferingIndicator = document.querySelector('.buffering-indicator');

    // Auto-start everything
    bufferingIndicator.style.display = 'none';
    playPauseBtn.textContent = '❚❚';
    
    // Load and play audio automatically
    audio.load();
    audio.play().catch(err => {
        console.log('Audio play error:', err);
        // Continue game even if audio fails
        if (!gameActive) {
            initGame();
        }
    });

    const volumeBtn = document.querySelector('.volume-btn');
    const progressBar = document.querySelector('.progress-bar');
    const progressFilled = document.querySelector('.progress-filled');
    const staticEffect = document.querySelector('.static-effect');
    const scoreDisplay = document.getElementById('game-score');
    const gameOverScreen = document.getElementById('game-over');
    const restartButton = document.getElementById('restart-button');
    const captionsElement = document.getElementById('video-captions');
    const captionToggle = document.getElementById('caption-toggle');
    const commentInput = document.getElementById('comment-input');
    const postCommentBtn = document.getElementById('post-comment');
    const commentsContainer = document.getElementById('comments-container');
    const commentCountElement = document.getElementById('comment-count');
    const likeBtn = document.getElementById('like-btn');
    const dislikeBtn = document.getElementById('dislike-btn');
    const likeCountElement = document.getElementById('like-count');
    const dislikeCountElement = document.getElementById('dislike-count');
    const rickrollLinks = document.querySelectorAll('[data-video="rickroll"]');
    const sidebarContainer = document.getElementById('sidebar-videos');
    const adContainer = document.getElementById('ad-container');
    const adVideo = document.getElementById('ad-video');
    const startOverlay = document.getElementById('youtube-start-overlay');
    
    window.addEventListener("gamepadconnected", (e) => {
        console.log("Gamepad connected:", e.gamepad);
        hasGamepad = true;
        controller = e.gamepad;
        document.querySelector('[data-device="controller"]').classList.remove('disabled');
    });

    window.addEventListener("gamepaddisconnected", (e) => {
        console.log("Gamepad disconnected:", e.gamepad);
        hasGamepad = false;
        controller = null;
        document.querySelector('[data-device="controller"]').classList.add('disabled');
    });

    function handleController() {
        if (!hasGamepad) return;
        
        const gamepads = navigator.getGamepads();
        const gamepad = gamepads[0];
        
        if (!gamepad) return;

        // Reset all directions
        keys.ArrowUp = false;
        keys.ArrowDown = false;
        keys.ArrowLeft = false;
        keys.ArrowRight = false;
        keys[' '] = false;

        // D-pad or left analog stick
        if (gamepad.axes[0] < -0.5 || gamepad.buttons[14].pressed) keys.ArrowLeft = true;
        if (gamepad.axes[0] > 0.5 || gamepad.buttons[15].pressed) keys.ArrowRight = true;
        if (gamepad.axes[1] < -0.5 || gamepad.buttons[12].pressed) keys.ArrowUp = true;
        if (gamepad.axes[1] > 0.5 || gamepad.buttons[13].pressed) keys.ArrowDown = true;

        // Buttons (A button or X button for shooting)
        if (gamepad.buttons[0].pressed || gamepad.buttons[2].pressed) keys[' '] = true;
    }

    document.querySelectorAll('.device-btn').forEach(btn => {
        if (!btn.classList.contains('disabled')) {
            btn.addEventListener('click', () => {
                const device = btn.dataset.device;
                if (device === 'mobile') {
                    isMobile = true;
                    initMobileControls();
                } else if (device === 'controller' && hasGamepad) {
                    isMobile = false;
                }
                document.getElementById('device-select').style.display = 'none';
                initGame();
            });
        }
    });

    function cleanupGame() {
        if (controllerInterval) {
            clearInterval(controllerInterval);
            controllerInterval = null;
        }
        gameActive = false;
        // ... any other cleanup code ...
    }

    // Set canvas size
    function resizeCanvas() {
        if (canvas) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            
            // Reposition player when resizing
            if (gameActive) {
                player.x = canvas.width / 2 - player.width / 2;
                player.y = canvas.height - player.height - 20;
            }
        }
    }
    
    window.addEventListener('resize', resizeCanvas);

    // Initialize the game
    function initGame() {
        resizeCanvas();
        gameActive = true;
        score = 0;
        player.health = 100;
        bullets = [];
        enemies = [];
        potions = [];
        stars = [];
        healthFood = [];
        
        // Create player ship
        player.x = canvas.width / 2 - player.width / 2;
        player.y = canvas.height - player.height - 20;
        
        // Create initial stars
        for (let i = 0; i < 50; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 2 + 0.5
            });
        }
        
        // Hide game over screen
        gameOverScreen.style.display = 'none';
        
        // Hide buffering
        bufferingIndicator.style.display = 'none';
        
        // Start game loop
        requestAnimationFrame(gameLoop);
        
        if (hasGamepad) {
            controllerInterval = setInterval(handleController, 16); // ~60fps
        }
    }
    
    // Game loop
    function gameLoop(timestamp) {
        if (!gameActive) return;
        
        // Clear the entire canvas before drawing new frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw black background
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw stars
        updateStars();
        
        // Handle player movement
        if (keys.ArrowLeft && player.x > 0) {
            player.x -= player.speed;
        }
        if (keys.ArrowRight && player.x < canvas.width - player.width) {
            player.x += player.speed;
        }
        if (keys.ArrowUp && player.y > 0) {
            player.y -= player.speed;
        }
        if (keys.ArrowDown && player.y < canvas.height - player.height) {
            player.y += player.speed;
        }
        
        // Handle shooting
        if (keys[' '] && bullets.length < 5) {
            const currentTime = Date.now();
            if (currentTime - player.lastShot >= 400) { 
                bullets.push({
                    x: player.x + player.width / 2 - 2,
                    y: player.y,
                    width: 4,
                    height: 10,
                    speed: 7
                });
                player.lastShot = currentTime;
            }
        }
        
        // Spawn normal enemies every 1 second
        if (timestamp - lastEnemySpawnTime > 1000) {
            enemies.push({
                x: Math.random() * (canvas.width - 20),
                y: -20,
                width: 20,
                height: 20,
                speed: Math.random() * 2 + 1,
                text: null,
                health: 1
            });
            lastEnemySpawnTime = timestamp;
        }

        // Spawn shooter enemies every 7 seconds
        if (!window.lastShooterSpawnTime) {
            window.lastShooterSpawnTime = timestamp;
        }
        if (timestamp - window.lastShooterSpawnTime > 7000) {
            enemies.push({
                x: Math.random() * (canvas.width - 20),
                y: -20,
                width: 60,
                height: 40,
                speed: Math.random() * 1.5 + 0.5,
                text: "SHOOTER",
                username: "Enemy",
                health: 5
            });
            window.lastShooterSpawnTime = timestamp;
        }
        
        // Update and draw bullets
        updateBullets();
        
        // Update and draw enemies
        updateEnemies();
        
        // Update and draw potions
        updatePotions();
        
        // Update and draw health food
        updateHealthFood();
        
        // Draw player
        drawPlayer();
        
        // Check collisions
        checkCollisions();
        
        // Update score display
        scoreDisplay.textContent = `SCORE: ${score} | HEALTH: ${player.health}`;
        
        // Update presence at the end of game loop
        updateGamePresence();
        
        // Spawn health food
        spawnHealthFood();
        
        // Continue game loop
        requestAnimationFrame(gameLoop);
    }
    
    function updateStars() {
        ctx.fillStyle = 'white';
        stars.forEach((star, index) => {
            star.y += star.speed;
            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    function updateBullets() {
        ctx.fillStyle = '#ff0';
        bullets.forEach((bullet, index) => {
            bullet.y -= bullet.speed;
            if (bullet.y < 0) {
                bullets.splice(index, 1);
            } else {
                ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            }
        });
    }
    
    function updateEnemies() {
        enemies.forEach((enemy, index) => {
            enemy.y += enemy.speed;
            if (enemy.y > canvas.height) {
                enemies.splice(index, 1);
            } else {
                if (enemy.text) {
                    // Comment enemy (text-based)
                    ctx.fillStyle = 'white'; 
                    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                    
                    // Draw username
                    ctx.fillStyle = '#03c'; 
                    ctx.font = 'bold 10px Arial';
                    ctx.fillText(enemy.username, enemy.x + 2, enemy.y + 10, enemy.width - 4); 
                    
                    // Draw comment text below username
                    ctx.fillStyle = 'black'; 
                    ctx.font = '12px Arial'; 
                    ctx.fillText(enemy.text, enemy.x + 2, enemy.y + 25, enemy.width - 4); 
                    
                    // Draw health bar
                    const healthWidth = (enemy.health / 5) * enemy.width;
                    ctx.fillStyle = '#333';
                    ctx.fillRect(enemy.x, enemy.y - 5, enemy.width, 3);
                    ctx.fillStyle = '#0f0';
                    ctx.fillRect(enemy.x, enemy.y - 5, healthWidth, 3);
                } else {
                    // Regular enemy
                    ctx.fillStyle = '#f00';
                    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                }
            }
        });
    }
    
    function updatePotions() {
        potions.forEach((potion, index) => {
            potion.y += potion.speed;
            
            if (potion.y > canvas.height) {
                potions.splice(index, 1);
            } else {
                // Draw potion
                ctx.fillStyle = potion.type === 'save' ? '#0f0' : '#f00';
                ctx.beginPath();
                ctx.arc(potion.x + potion.width/2, potion.y + potion.height/2, potion.width/2, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw potion outline
                ctx.strokeStyle = potion.type === 'save' ? '#0a0' : '#a00';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        });
    }
    
    function updateHealthFood() {
        ctx.fillStyle = '#0f0';
        healthFood.forEach((food, index) => {
            food.y += food.speed;
            
            if (food.y > canvas.height) {
                healthFood.splice(index, 1);
            } else {
                // Draw food (apple shape)
                ctx.beginPath();
                ctx.arc(food.x + food.width/2, food.y + food.height/2, food.width/2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#a00';
                ctx.fillRect(food.x + food.width/2 - 2, food.y - 5, 4, 10);
            }
        });
    }
    
    function drawPlayer() {
        // Draw player ship
        ctx.fillStyle = starPowerActive ? player.color : '#0f0';
        ctx.beginPath();
        ctx.moveTo(player.x + player.width / 2, player.y);
        ctx.lineTo(player.x, player.y + player.height);
        ctx.lineTo(player.x + player.width, player.y + player.height);
        ctx.closePath();
        ctx.fill();
        
        // Draw health bar (only if not in star power mode)
        if (!starPowerActive) {
            ctx.fillStyle = '#333';
            ctx.fillRect(player.x, player.y - 10, player.width, 5);
            
            ctx.fillStyle = player.health > 50 ? '#0f0' : (player.health > 25 ? '#ff0' : '#f00');
            const healthWidth = (player.health / 100) * player.width;
            ctx.fillRect(player.x, player.y - 10, healthWidth, 5);
        } else {
            // Draw rainbow health bar during star power
            ctx.fillStyle = '#' + Math.floor(Math.random()*16777215).toString(16);
            ctx.fillRect(player.x, player.y - 10, player.width, 5);
        }
    }
    
    function checkCollisions() {
        // Check bullet-enemy collisions
        bullets.forEach((bullet, bIndex) => {
            enemies.forEach((enemy, eIndex) => {
                if (bullet.x < enemy.x + enemy.width &&
                    bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + bullet.height > enemy.y) {
                    // Remove bullet
                    bullets.splice(bIndex, 1);
                    
                    if (enemy.text) { 
                        enemy.health--;
                        if (enemy.health <= 0) {
                            enemies.splice(eIndex, 1);
                            score += 15; 
                        }
                    } else { 
                        enemies.splice(eIndex, 1);
                        score += 10;
                    }
                }
            });
        });
        
        // Check player-enemy collisions
        enemies.forEach((enemy, index) => {
            if (player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y) {
                // Damage player
                player.health -= enemy.text ? 15 : 10; 
                enemies.splice(index, 1);
                
                if (player.health <= 0) {
                    // Game over
                    gameActive = false;
                    gameOverScreen.style.display = 'block';
                }
            }
        });
        
        // Check player-potion collisions
        potions.forEach((potion, index) => {
            if (player.x < potion.x + potion.width &&
                player.x + player.width > potion.x &&
                player.y < potion.y + potion.height &&
                player.y + player.height > potion.y) {
                // Apply potion effect
                if (potion.type === 'save') {
                    player.health = Math.min(player.health + 20, 100);
                } else if (potion.type === 'damage') {
                    player.health = Math.max(player.health - 10, 0);
                    
                    if (player.health <= 0) {
                        // Game over
                        gameActive = false;
                        gameOverScreen.style.display = 'block';
                    }
                }
                
                potions.splice(index, 1);
            }
        });
        
        // Check player-food collisions
        healthFood.forEach((food, index) => {
            if (player.x < food.x + food.width &&
                player.x + player.width > food.x &&
                player.y < food.y + food.height &&
                player.y + player.height > food.y) {
                
                player.health = Math.min(player.health + 10, 100);
                healthFood.splice(index, 1);
            }
        });
    }

    function spawnHealthFood() {
        if (Math.random() < 0.01) { // 1% chance each frame
            healthFood.push({
                x: Math.random() * (canvas.width - 20),
                y: -20,
                width: 15,
                height: 15,
                speed: 2
            });
        }
    }

    async function containsBannedWords(text) {
        // Skip if comment contains @autumn
        if (text.toLowerCase().includes('@autumn')) {
            return false;
        }

        // Check if user is already banned
        const bannedUsers = await room.collection('banned_users').getList();
        const username = room.party.client.username;
        
        if (bannedUsers.some(user => user.username === username)) {
            return true;
        }

        // Check for banned words
        const textToCheck = text.toLowerCase()
            .replace(/[^\w\s]/g, '') // Remove special characters
            .replace(/0/g, 'o')      // Replace number substitutions
            .replace(/1/g, 'i')
            .replace(/3/g, 'e')
            .replace(/4/g, 'a')
            .replace(/5/g, 's')
            .replace(/7/g, 't')
            .replace(/8/g, 'b')
            .replace(/@/g, 'a');     // Common letter substitutions

        // Check if any banned word is contained in the text
        const hasBannedWord = BANNED_WORDS.some(word => {
            const wordPattern = word.split('').join('\\s*'); // Allow spaces between letters
            const regex = new RegExp(wordPattern, 'i');
            return regex.test(textToCheck);
        });

        if (hasBannedWord) {
            // Add user to banned users collection
            await room.collection('banned_users').create({
                username: username,
                reason: 'Inappropriate language',
                timestamp: new Date().toISOString()
            });
            return true;
        }

        return false;
    }

    async function addNewComment(text) {
        if (await containsBannedWords(text)) {
            document.body.innerHTML = `
                <div style="text-align: center; padding: 50px; background: #fff;">
                    <h1 style="color: #ff0000;">You Have Been Banned</h1>
                    <p>Your comment contained inappropriate content.</p>
                    <p>This account has been permanently suspended.</p>
                </div>
            `;
            return;
        }

        let creatorUsername = (await window.websim.getCreatedBy()).username;
        const newComment = document.createElement('div');
        newComment.className = 'comment';
        
        newComment.innerHTML = `
            <div class="comment-user">
                <a href="channel.html?channel=${creatorUsername}" class="channel-link">${creatorUsername}</a>
            </div>
            <div class="comment-text">${text}</div>
            <div class="comment-date">just now</div>
        `;
        
        commentsContainer.insertBefore(newComment, commentsContainer.firstChild);
        
        commentCount++;
        commentCountElement.textContent = commentCount;

        room.send({
            type: 'newComment',
            text: text,
            username: creatorUsername
        });
        
        if (gameActive) {
            enemies.push({
                x: Math.random() * (canvas.width - 20),
                y: -20,
                width: 60, 
                height: 40, 
                speed: Math.random() * 2 + 1,
                text: text.length > 10 ? text.substring(0, 10) + '...' : text,
                username: creatorUsername, 
                health: 5
            });
        }
    }

    async function displayCommentEnemy(commentData) {
        if (gameActive) {
            enemies.push({
                x: Math.random() * (canvas.width - 20),
                y: -20,
                width: 60, 
                height: 40, 
                speed: Math.random() * 2 + 1,
                text: commentData.text.length > 10 ? commentData.text.substring(0, 10) + '...' : commentData.text,
                username: commentData.username, 
                health: 5
            });
        }
    }
    
    // Add like potion
    async function addLikePotion() {
        room.send({ type: 'like' });
        likeCount++;
        likeCountElement.textContent = likeCount;
    }
    
    // Add dislike potion
    async function addDislikePotion() {
        room.send({ type: 'dislike' });
        dislikeCount++;
        dislikeCountElement.textContent = dislikeCount;
    }
    
    function createSidebarVideos() {
        sidebarContainer.innerHTML = '';
        
        // Randomly choose between the three ad thumbnails and titles
        const adOptions = [
            {
                thumbnail: 'https://files.catbox.moe/zemmep.webp',
                title: 'How to turn into a paper man',
                channel: 'PaperArtTutorials'
            },
            {
                thumbnail: 'https://images.websim.ai/avatar/KeyinGames',
                title: 'Keyin plays Space Invaders',
                channel: 'KeyinGames'
            },
            {
                thumbnail: '/Screenshot 2025-03-08 104458.png',
                title: 'Thanks websim.',
                channel: 'WebsimArchive'
            }
        ];
        
        const randomAd = adOptions[Math.floor(Math.random() * adOptions.length)];
        
        // Add sponsored video at top
        const sponsoredVideo = document.createElement('div');
        sponsoredVideo.className = 'sidebar-video';
        sponsoredVideo.innerHTML = `
            <div class="sidebar-thumbnail" style="background-image: url('${randomAd.thumbnail}');">
                <div class="duration">3:24</div>
                <div class="ad-badge">Ad</div>
            </div>
            <div class="sidebar-info">
                <div class="sidebar-title">${randomAd.title}</div>
                <div class="sidebar-channel">
                    <a href="channel.html?channel=${randomAd.channel}" class="channel-link">${randomAd.channel}</a>
                </div>
                <div class="sidebar-stats">Sponsored</div>
            </div>
        `;
        sidebarContainer.appendChild(sponsoredVideo);
        
        // Add free quarters link
        const freeQuarters = document.createElement('div');
        freeQuarters.className = 'sidebar-video';
        freeQuarters.innerHTML = `
            <div class="sidebar-thumbnail" style="background-image: url('${quarterThumbnails[Math.floor(Math.random() * quarterThumbnails.length)]}');">
                <div class="duration">2:31</div>
            </div>
            <div class="sidebar-info">
                <div class="sidebar-title">FREE QUARTERS (2024)</div>
                <div class="sidebar-channel">KeyinGaming</div>
                <div class="sidebar-stats">1.2M views</div>
            </div>
        `;
        
        freeQuarters.addEventListener('click', () => {
            window.location.href = 'adblock.html'; 
        });
        
        sidebarContainer.appendChild(freeQuarters);
        
        // Add quarter video
        const quarterVideo = document.createElement('div');
        quarterVideo.className = 'sidebar-video';
        quarterVideo.innerHTML = `
            <div class="sidebar-thumbnail" style="background-color: #ccc;">
                <div class="duration">0:01</div>
            </div>
            <div class="sidebar-info">
                <div class="sidebar-title">Quarter</div>
                <div class="sidebar-channel">USA GOVERNMENT</div>
                <div class="sidebar-stats">0 views</div>
            </div>
        `;
        
        quarterVideo.addEventListener('click', () => {
            hasQuarter = true;
            alert('YOU CAN USE THIS AT GAME OVER!');
        });
        
        sidebarContainer.appendChild(quarterVideo);

        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * videoTitles.length);
            const videoElement = document.createElement('div');
            videoElement.className = 'sidebar-video';
            
            let thumbnailStyle = '';
            let videoTitle = videoTitles[randomIndex];
            
            if (videoTitle.toLowerCase().includes('keyin')) {
                thumbnailStyle = `background-image: url('/Screenshot 2025-03-04 213238.png');`;
            } else if (Math.random() > 0.6 && customThumbnails.length > 0) {
                const randomThumb = customThumbnails[Math.floor(Math.random() * customThumbnails.length)];
                thumbnailStyle = `background-image: url('${randomThumb}');`;
            } else {
                const colors = ['%23f00', '%230f0', '%2300f', '%23ff0', '%23f0f', '%230ff'];
                const randomColor1 = colors[Math.floor(Math.random() * colors.length)];
                const randomColor2 = colors[Math.floor(Math.random() * colors.length)];
                
                thumbnailStyle = `background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><rect width="320" height="180" fill="%23000"/><rect x="${40 + Math.random() * 40}" y="${40 + Math.random() * 40}" width="${80 + Math.random() * 60}" height="${40 + Math.random() * 40}" fill="${randomColor1}"/><rect x="${160 + Math.random() * 40}" y="${80 + Math.random() * 40}" width="${60 + Math.random() * 40}" height="${40 + Math.random() * 30}" fill="${randomColor2}"/></svg>');`;
            }
            
            const isRickroll = Math.random() < 0.1; 
            const clickHandler = isRickroll ? 'data-video="rickroll"' : '';
            
            videoElement.innerHTML = `
                <div class="sidebar-thumbnail" style="${thumbnailStyle}" ${clickHandler}>
                    <div class="duration">${durations[randomIndex]}</div>
                </div>
                <div class="sidebar-info">
                    <div class="sidebar-title">${videoTitles[randomIndex]}</div>
                    <div class="sidebar-channel">
                        <a href="channel.html?channel=${channelNames[randomIndex]}" class="channel-link">${channelNames[randomIndex]}</a>
                    </div>
                    <div class="sidebar-stats">${viewCounts[randomIndex]} views</div>
                </div>
            `;
            
            if (isRickroll) {
                videoElement.querySelector('.sidebar-thumbnail').addEventListener('click', function() {
                    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
                    gameActive = false;
                    audio.pause();
                    playPauseBtn.textContent = '▶';
                });
            } else {
                videoElement.querySelector('.sidebar-thumbnail').addEventListener('click', function() {
                    window.location.href = 'under_construction.html';
                    gameActive = false;
                    audio.pause();
                    playPauseBtn.textContent = '▶';
                });
            }
            
            sidebarContainer.appendChild(videoElement);
        }
    }

    function activateStarPower() {
        if (starPowerActive) return;
        
        starPowerActive = true;
        player.speed = 15; // Triple speed
        player.health = Infinity;
        
        // Flash colors
        const playerFlash = setInterval(() => {
            player.color = '#' + Math.floor(Math.random()*16777215).toString(16);
        }, 100);
        
        // Reset after 10 seconds
        starPowerTimeout = setTimeout(() => {
            starPowerActive = false;
            player.speed = originalSpeed;
            player.health = originalHealth;
            player.color = '#0f0';
            clearInterval(playerFlash);
        }, 10000);
    }

    // Event listeners for keyboard controls
    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        if (e.key === ' ' || ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault(); 
        }
    });
    
    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });
    
    // Restart button
    restartButton.addEventListener('click', () => {
        if (hasQuarter) {
            // Insert quarter animation
            const quarter = document.createElement('div');
            quarter.className = 'quarter-animation';
            document.querySelector('.video-content').appendChild(quarter);
            
            // Remove quarter after animation
            setTimeout(() => {
                quarter.remove();
                hasQuarter = false;
                initGame();
            }, 1000);
        } else {
            alert('Insert Quarter to Continue!');
        }
    });
    
    function showAd() {
        if (adPlaying) return;
        
        adPlaying = true;
        gameActive = false;
        if (audio) {
            audio.pause();
        }
        adContainer.classList.remove('hidden');
        canvas.style.display = 'none';
        bufferingIndicator.style.display = 'none';
        gameOverScreen.style.display = 'none';
        
        const adVideos = [
            '/0308 (2).mp4',
            '/0306 (4).mp4'
        ];
        const selectedAd = adVideos[Math.floor(Math.random() * adVideos.length)];
        adVideo.src = selectedAd;
        adVideo.muted = false;
        
        // Show skip button after 5 seconds
        skipAdBtn.style.display = 'none';
        setTimeout(() => {
            skipAdBtn.style.display = 'block';
        }, 5000);

        // Attempt to play the video
        const playPromise = adVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Ad playback failed:", error);
                hideAd(); // Fallback if ad fails to play
            });
        }

        // Force end after 30 seconds max
        setTimeout(() => {
            if (adPlaying) {
                hideAd();
            }
        }, 30000);
    }

    function hideAd() {
        if (!adPlaying) return;
        
        adPlaying = false;
        adContainer.classList.add('hidden');
        canvas.style.display = 'block';
        adVideo.pause();
        adVideo.currentTime = 0;
        gameActive = true;
        
        // Schedule next ad
        nextAdTime = Math.random() * (30 - 16) + 16;
        adTimer = setTimeout(showAd, nextAdTime * 1000);
    }

    const skipAdBtn = document.getElementById('skip-ad');
    skipAdBtn.addEventListener('click', () => {
        if (skipAdBtn.style.display === 'block') {
            hideAd();
        }
    });

    adVideo.addEventListener('ended', hideAd);

    // Audio controls
    try {
        audio.volume = 0.7;
        playPauseBtn.textContent = '❚❚';
        
    } catch (e) {
         console.log('Audio setup error:', e);
     }
     
    function togglePlay() {
        if (audio.paused) {
            audio.play();
            playPauseBtn.textContent = '❚❚';
            if (!gameActive) {
                initGame();
            }
        } else {
            audio.pause();
            playPauseBtn.textContent = '▶';
            gameActive = false;
        }
    }
    
    playPauseBtn.addEventListener('click', togglePlay);
    
    progressBar.addEventListener('click', function(e) {
        const pos = (e.pageX - this.offsetLeft) / this.offsetWidth;
        audio.currentTime = pos * audio.duration;
    });
    
    volumeBtn.addEventListener('click', function() {
        if (audio.volume > 0) {
            audio.volume = 0;
            volumeBtn.textContent = '🔇';
        } else {
            audio.volume = 0.7;
            volumeBtn.textContent = '🔊';
        }
    });
    
    captionToggle.addEventListener('click', function() {
        captionsOn = !captionsOn;
        this.classList.toggle('active');
        
        if (captionsOn) {
            updateCaptions();
            captionInterval = setInterval(updateCaptions, 3000);
        } else {
            clearInterval(captionInterval);
            captionsElement.style.display = 'none';
        }
    });
    
    postCommentBtn.addEventListener('click', function() {
        const commentText = commentInput.value.trim();
        
        if (commentText) {
            addNewComment(commentText);
            commentInput.value = '';
        }
    });
    
    likeBtn.addEventListener('click', function() {
        likeCount++;
        likeCountElement.textContent = likeCount;
        addLikePotion();
    });
    
    dislikeBtn.addEventListener('click', function() {
        dislikeCount++;
        dislikeCountElement.textContent = dislikeCount;
        addDislikePotion();
    });
    
    audio.addEventListener('timeupdate', function() {
        document.querySelector('.time').textContent = `${Math.floor(audio.currentTime / 60)}:${Math.floor(audio.currentTime % 60).toString().padStart(2, '0')} / ∞`;
    });
    
    rickrollLinks.forEach(link => {
        link.addEventListener('click', function() {
            window.location.href = 'rickroll.html';
            gameActive = false;
            audio.pause();
            playPauseBtn.textContent = '▶';
        });
    });
    
    const subscribeBtn = document.getElementById('subscribe-btn');
    const subscriberCountElement = document.getElementById('subscriber-count');

    subscribeBtn.addEventListener('click', function() {
        if (!this.classList.contains('subscribed')) {
            subscriberCount++;
            subscriberCountElement.textContent = subscriberCount;
            this.textContent = 'Subscribed';
            this.classList.add('subscribed');
            activateStarPower();
            
            // Announce subscription
            room.send({
                type: 'subscribe',
                count: subscriberCount
            });
        }
    });

    const spectateBtn = document.getElementById('spectate-btn');
    const spectateWarning = document.getElementById('spectate-warning');
    const closeSpectateBtn = document.getElementById('close-spectate');
    let spectating = false;
    let spectatingUserId = null;

    function showSpectateWarning(message) {
        spectateWarning.classList.remove('hidden');
        const warningContent = spectateWarning.querySelector('.warning-content');
        warningContent.innerHTML = `
            <p>${message}</p>
            <div class="spectate-list">
                ${Object.entries(room.party.presence)
                    .filter(([id, data]) => id !== room.party.client.id && data.gameActive)
                    .map(([id, data]) => `
                        <button class="spectate-player-btn" data-id="${id}">
                            Spectate ${room.party.peers[id]?.username || 'Player'}
                        </button>
                    `).join('')}
            </div>
            <button id="close-spectate">Close</button>
        `;

        // Add click handlers for new spectate buttons
        warningContent.querySelectorAll('.spectate-player-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                spectateWarning.classList.add('hidden');
                startSpectating(btn.dataset.id);
            });
        });
    }

    function startSpectating(userId = null) {
        if (!userId) {
            // Show player selection dialog
            showSpectateWarning('Choose a player to spectate:');
            return;
        }

        const playerData = room.party.presence[userId];
        if (!playerData || !playerData.gameActive || playerData.paused || playerData.adPlaying || playerData.gameOver) {
            showSpectateWarning('Cannot spectate this player right now');
            return;
        }

        spectatingUserId = userId;
        spectating = true;
        gameActive = false;
        audio.pause();
        spectateBtn.textContent = 'Stop Spectating';

        // Start spectate loop
        function spectateRender() {
            const currentData = room.party.presence[spectatingUserId];
            
            if (!currentData || currentData.paused || currentData.gameOver || !currentData.gameActive) {
                stopSpectating();
                showSpectateWarning('Stream ended: Player paused/ended their game');
                return;
            }

            if (currentData.adPlaying) {
                stopSpectating();
                showSpectateWarning('The person is having an ad, please wait');
                return;
            }

            // Clear the entire canvas before drawing new frame
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw black background
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw stars
            updateStars();
            
            // Draw player
            ctx.fillStyle = '#0f0';
            ctx.beginPath();
            ctx.moveTo(currentData.playerX + player.width / 2, currentData.playerY);
            ctx.lineTo(currentData.playerX, currentData.playerY + player.height);
            ctx.lineTo(currentData.playerX + player.width, currentData.playerY + player.height);
            ctx.closePath();
            ctx.fill();

            // Draw bullets
            ctx.fillStyle = '#ff0';
            currentData.bullets.forEach(bullet => {
                ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            });

            // Draw enemies
            currentData.enemies.forEach(enemy => {
                if (enemy.text) {
                    ctx.fillStyle = 'white';
                    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                    
                    ctx.fillStyle = '#03c';
                    ctx.font = 'bold 20px Arial';
                    ctx.fillText(enemy.username, enemy.x + 2, enemy.y + 20);
                    
                    ctx.fillStyle = 'black';
                    ctx.font = '24px Arial';
                    ctx.fillText(enemy.text, enemy.x + 2, enemy.y + 50);
                    
                    const healthWidth = (enemy.health / 5) * enemy.width;
                    ctx.fillStyle = '#333';
                    ctx.fillRect(enemy.x, enemy.y - 10, enemy.width, 6);
                    ctx.fillStyle = '#0f0';
                    ctx.fillRect(enemy.x, enemy.y - 10, healthWidth, 6);
                } else {
                    ctx.fillStyle = '#f00';
                    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                }
            });

            // Draw score
            scoreDisplay.textContent = `SPECTATING: ${room.party.peers[spectatingUserId]?.username || 'Player'} | SCORE: ${currentData.score} | HEALTH: ${currentData.health}`;
            
            spectateLoop = requestAnimationFrame(spectateRender);
        }
        
        spectateLoop = requestAnimationFrame(spectateRender);
    }

    function stopSpectating() {
        if (spectateLoop) {
            cancelAnimationFrame(spectateLoop);
        }
        spectating = false;
        spectatingUserId = null;
        spectateBtn.textContent = 'Spectate';
        scoreDisplay.textContent = `SCORE: ${score} | HEALTH: ${player.health}`;
    }

    spectateBtn.addEventListener('click', function() {
        if (spectating) {
            stopSpectating();
        } else {
            startSpectating();
        }
    });

    closeSpectateBtn.addEventListener('click', function() {
        stopSpectating();
        spectateWarning.classList.add('hidden');
    });

    function updateGamePresence() {
        room.party.updatePresence({
            gameActive,
            playerX: player.x,
            playerY: player.y,
            score,
            health: player.health,
            bullets,
            enemies,
            paused: audio.paused,
            adPlaying,
            gameOver: !gameActive
        });
    }

    audio.addEventListener('play', updateGamePresence);
    audio.addEventListener('pause', updateGamePresence);

    createSidebarVideos();

    bufferingIndicator.style.display = 'block';

    const room = new WebsimSocket();

    async function generateProfileIcon() {
        const profileIcon = document.getElementById('profile-icon');
        let creatorUsername = (await window.websim.getCreatedBy()).username;
        profileIcon.innerHTML = `<img src="https://api.dicebear.com/6.x/initials/svg?seed=${creatorUsername}" alt="Profile Icon" style="width: 100%; height: 100%; border-radius: 50%;">`;
    }

    room.onmessage = (event) => {
        const data = event.data;
        
        switch (data.type) {
            case 'newComment':
                if (!containsBannedWords(data.text)) {
                    const newComment = document.createElement('div');
                    newComment.className = 'comment';
                    newComment.innerHTML = `
                        <div class="comment-user">
                            <a href="channel.html?channel=${data.username}" class="channel-link">${data.username}</a>
                        </div>
                        <div class="comment-text">${data.text}</div>
                        <div class="comment-date">just now</div>
                    `;
                    commentsContainer.insertBefore(newComment, commentsContainer.firstChild);
                    commentCount++;
                    commentCountElement.textContent = commentCount;

                    displayCommentEnemy(data);
                }
                break;

            case 'like':
                likeCount++;
                likeCountElement.textContent = likeCount;
                break;

            case 'dislike':
                dislikeCount++;
                dislikeCountElement.textContent = dislikeCount;
                break;

            case 'subscribe':
                subscriberCount = data.count;
                subscriberCountElement.textContent = subscriberCount;
                break;

            default:
                console.log('Received event:', data);
        }
    };

    generateProfileIcon();
    
    adTimer = setTimeout(showAd, nextAdTime * 1000);
});