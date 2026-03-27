// Global variables
let activeWindow = null;
let windowZ = 100;
let windowsOpen = {};
let startMenuOpen = false;
let peppaDollars = 0;
let hasPlayedStartupSound = false;
let installedApps = ['browser', 'peppatube', 'notes', 'photos', 'store', 'settings', 'pigcraft', 'fnapp', 'calendar', 'music', 'peppablox', 'terminal', 'file-explorer', 'trash', 'antivirus', 'peppabox', 'paint', 'pigpoint', 'wordpig', 'peppacel', 'georgeanimate', 'daddybasics', 'mnn'];
let availableApps = [
    { id: 'browser', name: 'Muddy Poodle', icon: 'browser_icon.png', price: 0, installed: true },
    { id: 'peppatube', name: 'PeppaTube', icon: 'peppatube_icon.png', price: 0, installed: true },
    { id: 'notes', name: 'Oink Notes', icon: 'notes_icon.png', price: 0, installed: true },
    { id: 'photos', name: 'Muddy Photos', icon: 'photos_icon.png', price: 0, installed: true },
    { id: 'store', name: 'Peppa Store', icon: 'peppa_store_icon.png', price: 0, installed: true }, 
    { id: 'settings', name: 'Settings', icon: 'settings_icon.png', price: 0, installed: true },
    { id: 'pigcraft', name: 'Pigcraft', icon: 'pigcraft_icon.png', price: 0, installed: true },
    { id: 'fnapp', name: 'FNAPP', icon: 'peppa_angry.png', price: 0, installed: true },
    { id: 'calendar', name: 'Piggy Calendar', icon: 'calendar_icon.png', price: 0, installed: true }, 
    { id: 'music', name: 'Peppa Music', icon: 'music_icon.png', price: 0, installed: true }, 
    { id: 'peppablox', name: 'Peppablox', icon: 'peppablox_icon.png', price: 0, installed: true },
    { id: 'terminal', name: 'Pigmanal', icon: 'terminal_icon.png', price: 0, installed: true },
    { id: 'games', name: 'Piggy Games', icon: 'peppa_avatar.png', price: 15, installed: false },
    { id: 'stories', name: 'Bedtime Stories', icon: 'peppa_avatar.png', price: 8, installed: false }, 
    { id: 'weather', name: 'Piggy Weather', icon: 'browser_icon.png', price: 12, installed: false }, 
    { id: 'recipes', name: 'Pig Recipes', icon: 'notes_icon.png', price: 7, installed: false }, 
    { id: 'chat', name: 'Oink Chat', icon: 'peppa_assistant.png', price: 20, installed: false },
    { id: 'mnn', name: 'MNN', icon: 'mnn_icon.png', price: 0, installed: true }
];

let tasks = [
    { id: 1, name: "Click on Peppa Assistant", reward: 5, completed: false },
    { id: 2, name: "Change your wallpaper", reward: 10, completed: false },
    { id: 3, name: "Open PeppaTube", reward: 5, completed: false },
    { id: 4, name: "Type something in Oink Notes", reward: 8, completed: false }
];

// Initialize when the document is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Handle boot screen
    setTimeout(() => {
        const bootScreen = document.getElementById('boot-screen');
        if (bootScreen) {
            bootScreen.style.opacity = '0';
            setTimeout(() => {
                bootScreen.style.display = 'none';
                
                // Play startup sound after boot screen
                const startupSound = document.getElementById('startup-sound');
                if (startupSound) {
                    startupSound.play().catch(error => console.log("Audio play failed:", error));
                    hasPlayedStartupSound = true;
                }
            }, 500);
        }
    }, 5000);
    
    // Set up event listeners
    document.querySelector('.start-button').addEventListener('click', toggleStartMenu);
    document.addEventListener('click', function(e) {
        // Close start menu if clicking outside
        if (!e.target.closest('.start-menu') && !e.target.closest('.start-button') && startMenuOpen) {
            toggleStartMenu();
        }
    });

    // Desktop icons
    document.querySelectorAll('.icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const app = this.getAttribute('data-app');
            openApp(app);
        });
    });

    // Start menu items
    document.querySelectorAll('.start-item').forEach(item => {
        item.addEventListener('click', function() {
            const app = this.getAttribute('data-app');
            const action = this.getAttribute('data-action');
            
            if (action === 'shutdown') {
                shutdown();
            } else if (app) {
                openApp(app);
                toggleStartMenu();
            }
        });
    });

    // Update the clock
    updateClock();
    setInterval(updateClock, 1000); // Update every second for smoother analog clock
    
    // Initialize analog clock
    updateAnalogClock();
    setInterval(updateAnalogClock, 1000);

    // Initialize Peppa Assistant
    initPeppaAssistant();

    // Initialize Photo Context Menu
    initPhotoContextMenu();

    // Initialize Peppa currency
    updateCurrencyDisplay();

    // Initialize George interaction
    initGeorge();
    
    // Pink screen restart button
    const psodRestartBtn = document.getElementById('psod-restart');
    if (psodRestartBtn) {
        psodRestartBtn.addEventListener('click', function() {
            location.reload();
        });
    }
});

// Toggle start menu visibility
function toggleStartMenu() {
    const startMenu = document.getElementById('start-menu');
    startMenuOpen = !startMenuOpen;
    startMenu.style.display = startMenuOpen ? 'block' : 'none';
}

// Update the clock
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}`;
}

// Update analog clock
function updateAnalogClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12;
    
    const secondDegrees = (seconds / 60) * 360;
    const minuteDegrees = ((minutes + seconds/60) / 60) * 360;
    const hourDegrees = ((hours + minutes/60) / 12) * 360;
    
    const secondHand = document.querySelector('.second-hand');
    const minuteHand = document.querySelector('.minute-hand');
    const hourHand = document.querySelector('.hour-hand');
    
    if (secondHand && minuteHand && hourHand) {
        secondHand.style.transform = `rotate(${secondDegrees}deg)`;
        minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
        hourHand.style.transform = `rotate(${hourDegrees}deg)`;
    }
}

// Open application
function openApp(appName) {
    // Check if the app is installed
    if (!installedApps.includes(appName)) {
        // Show a message that the app needs to be purchased but don't redirect
        const assistantBubble = document.querySelector('.assistant-bubble');
        const assistantMessage = document.querySelector('.assistant-message');
        assistantMessage.textContent = `You need to buy ${getAppName(appName)} from the Peppa Store. *snort*`;
        assistantBubble.style.display = 'block';
        
        // Hide message after 3 seconds
        setTimeout(() => {
            assistantBubble.style.display = 'none';
        }, 3000);
        
        return;
    }

    // If the app is already open, just focus it
    if (windowsOpen[appName]) {
        focusWindow(windowsOpen[appName]);
        
        // Mark task as completed if it's "Open PeppaTube"
        if (appName === 'peppatube') {
            completeTask(3);
        }
        
        return;
    }

    let title, content;
    
    switch(appName) {
        case 'browser':
            title = 'Muddy Poodle';
            content = createBrowserContent('muddy-poodle');
            break;
        case 'peppatube':
            title = 'PeppaTube';
            content = createBrowserContent('peppatube');
            // Mark task as completed
            completeTask(3);
            break;
        case 'notes':
            title = 'Oink Notes';
            content = '<textarea class="notes-area" style="width: 100%; height: 100%; resize: none; border: none; padding: 10px;"></textarea>';
            
            // Add event listener to check for typing in notes
            setTimeout(() => {
                const notesArea = document.querySelector('.notes-area');
                if (notesArea) {
                    notesArea.addEventListener('input', function() {
                        completeTask(4);
                    });
                }
            }, 100);
            break;
        case 'photos':
            title = 'Muddy Photos';
            content = createPhotosContent();
            break;
        case 'store':
            title = 'Peppa Store';
            content = createStoreContent();
            break;
        case 'settings':
            title = 'Settings';
            content = createSettingsContent();
            break;
        case 'pigcraft':
            title = 'Pigcraft';
            content = createPigcraftContent();
            break;
        case 'fnapp':
            // Show warning first instead of opening directly
            showFNAPPWarning();
            return; // Return early to prevent window creation until user confirms
        case 'calendar':
            title = 'Piggy Calendar';
            content = createCalendarContent();
            break;
        case 'music':
            title = 'Peppa Music';
            content = createMusicContent();
            break;
        case 'peppablox':
            title = 'Peppablox';
            content = createPeppabloxContent();
            break;
        case 'terminal':
            title = 'Pigmanal';
            content = createTerminalContent();
            break;
        case 'games':
            title = 'Piggy Games';
            content = createGamesContent();
            break;
        case 'paint':
            title = 'Muddy Paint';
            content = createPaintContent();
            break;
        case 'stories':
            title = 'Bedtime Stories';
            content = createStoriesContent();
            break;
        case 'weather':
            title = 'Piggy Weather';
            content = createWeatherContent();
            break;
        case 'recipes':
            title = 'Pig Recipes';
            content = createRecipesContent();
            break;
        case 'chat':
            title = 'Oink Chat';
            content = createChatContent();
            break;
        case 'file-explorer':
            title = 'File Explorer';
            content = createFileExplorerContent();
            break;
        case 'trash':
            title = 'Trash';
            content = createTrashContent();
            break;
        case 'antivirus':
            title = 'Peppa Shield';
            content = createAntivirusContent();
            break;
        case 'peppabox':
            title = 'PeppaBox';
            content = createPeppaBoxContent();
            break;
        case 'pigpoint':
            title = 'Pigpoint';
            content = createPigpointContent();
            break;
        case 'wordpig':
            title = 'Wordpig';
            content = createWordpigContent();
            break;
        case 'peppacel':
            title = 'Peppacel';
            content = createPeppacelContent();
            break;
        case 'georgeanimate':
            title = 'GeorgeAnimate';
            content = createGeorgeAnimateContent();
            break;
        case 'daddybasics':
            // Show warning first instead of opening directly
            showDaddyBasicsWarning();
            return; // Return early to prevent window creation until user confirms
        case 'mnn':
            title = 'Muddy News Network';
            content = createMNNContent();
            break;
        default:
            title = 'Application';
            content = '<div style="padding: 20px;">Application content here</div>';
    }

    createWindow(appName, title, content);
}

// Create a new window
function createWindow(appName, title, content) {
    const windowsContainer = document.getElementById('windows-container');
    const windowId = 'window-' + Date.now();
    
    const windowElement = document.createElement('div');
    windowElement.className = 'window';
    windowElement.id = windowId;
    windowElement.style.width = '600px';
    windowElement.style.height = '400px';
    windowElement.style.left = '50px';
    windowElement.style.top = '50px';
    windowElement.style.zIndex = ++windowZ;
    
    windowElement.innerHTML = `
        <div class="window-header">
            <div class="window-title">${title}</div>
            <div class="window-controls">
                <div class="window-control window-minimize"></div>
                <div class="window-control window-maximize"></div>
                <div class="window-control window-close"></div>
            </div>
        </div>
        <div class="window-content">${content}</div>
    `;
    
    windowsContainer.appendChild(windowElement);
    
    // Make window draggable
    makeDraggable(windowElement);
    
    // Add window controls
    const closeBtn = windowElement.querySelector('.window-close');
    closeBtn.addEventListener('click', function() {
        closeWindow(windowId, appName);
    });
    
    const minimizeBtn = windowElement.querySelector('.window-minimize');
    minimizeBtn.addEventListener('click', function() {
        minimizeWindow(windowId);
    });
    
    const maximizeBtn = windowElement.querySelector('.window-maximize');
    maximizeBtn.addEventListener('click', function() {
        maximizeWindow(windowId);
    });
    
    // Focus the window
    focusWindow(windowElement);
    
    // Add to taskbar
    addToTaskbar(appName, title, windowId);
    
    // Store reference to open window
    windowsOpen[appName] = windowElement;
    
    // Add app-specific event listeners
    setTimeout(() => {
        if (appName === 'pigcraft') {
            setupPigcraftEvents();
        } else if (appName === 'fnapp') {
            setupFNAPPEvents();
        } else if (appName === 'peppabox') {
            setupPeppaBoxEvents();
        } else if (appName === 'daddybasics') {
            setupDaddyBasicsEvents();
        } else {
            // Add listeners for our new apps
            addAppSpecificListeners(appName);
        }
    }, 100);
    
    return windowElement;
}

// Setup Pigcraft events
function setupPigcraftEvents() {
    const startButton = document.getElementById('minecraft-start');
    if (startButton) {
        startButton.addEventListener('click', function() {
            const titleScreen = document.querySelector('.minecraft-title-screen');
            const gameScreen = document.querySelector('.minecraft-game-screen');
            
            if (titleScreen && gameScreen) {
                titleScreen.style.display = 'none';
                gameScreen.style.display = 'block';
                
                // Make message disappear after a delay
                const messageElement = document.querySelector('.minecraft-message');
                if (messageElement) {
                    setTimeout(() => {
                        messageElement.style.display = 'none';
                        
                        // Transition to 3D view
                        const minecraftWorld = document.querySelector('.minecraft-world');
                        if (minecraftWorld) {
                            minecraftWorld.classList.add('minecraft-3d-view');
                        }
                    }, 2000);
                }
            }
        });
    }
}

// Make an element draggable
function makeDraggable(element) {
    const header = element.querySelector('.window-header');
    let offsetX, offsetY;
    
    header.addEventListener('mousedown', function(e) {
        if (e.target.closest('.window-control')) return;
        
        focusWindow(element);
        
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        
        document.addEventListener('mousemove', moveElement);
        document.addEventListener('mouseup', stopMovingElement);
    });
    
    function moveElement(e) {
        element.style.left = (e.clientX - offsetX) + 'px';
        element.style.top = (e.clientY - offsetY) + 'px';
    }
    
    function stopMovingElement() {
        document.removeEventListener('mousemove', moveElement);
        document.removeEventListener('mouseup', stopMovingElement);
    }
}

// Focus a window (bring to front)
function focusWindow(windowElement) {
    if (activeWindow) {
        activeWindow.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    }
    
    activeWindow = windowElement;
    windowElement.style.zIndex = ++windowZ;
    windowElement.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.5)';
}

// Close a window
function closeWindow(windowId, appName) {
    const window = document.getElementById(windowId);
    if (window) {
        window.remove();
    }
    
    // Remove from taskbar
    const taskbarItem = document.querySelector(`.taskbar-item[data-window="${windowId}"]`);
    if (taskbarItem) {
        taskbarItem.remove();
    }
    
    // Remove from open windows tracking
    if (windowsOpen[appName]) {
        delete windowsOpen[appName];
    }
    
    if (activeWindow === window) {
        activeWindow = null;
    }
}

// Minimize a window
function minimizeWindow(windowId) {
    const window = document.getElementById(windowId);
    if (window) {
        window.style.display = 'none';
    }
}

// Maximize a window
function maximizeWindow(windowId) {
    const window = document.getElementById(windowId);
    if (!window) return;
    
    if (window.getAttribute('data-maximized') === 'true') {
        // Restore to previous size
        const prevState = window.getAttribute('data-prev-state');
        if (prevState) {
            const { width, height, left, top } = JSON.parse(prevState);
            window.style.width = width;
            window.style.height = height;
            window.style.left = left;
            window.style.top = top;
        }
        window.setAttribute('data-maximized', 'false');
    } else {
        // Save current state and maximize
        const prevState = {
            width: window.style.width,
            height: window.style.height,
            left: window.style.left,
            top: window.style.top
        };
        window.setAttribute('data-prev-state', JSON.stringify(prevState));
        
        window.style.width = '100%';
        window.style.height = 'calc(100% - 40px)';
        window.style.left = '0';
        window.style.top = '0';
        window.setAttribute('data-maximized', 'true');
    }
}

// Add an application to the taskbar
function addToTaskbar(appName, title, windowId) {
    const taskbarItems = document.querySelector('.taskbar-items');
    const taskbarItem = document.createElement('div');
    taskbarItem.className = 'taskbar-item';
    taskbarItem.setAttribute('data-window', windowId);
    
    let iconSrc;
    switch(appName) {
        case 'browser':
            iconSrc = 'browser_icon.png';
            break;
        case 'peppatube':
            iconSrc = 'peppatube_icon.png';
            break;
        case 'notes':
            iconSrc = 'notes_icon.png';
            break;
        case 'photos':
            iconSrc = 'photos_icon.png';
            break;
        default:
            iconSrc = 'app_icon.png';
    }
    
    taskbarItem.innerHTML = `
        <img src="${iconSrc}" alt="${title}">
        <span>${title}</span>
    `;
    
    taskbarItem.addEventListener('click', function() {
        const window = document.getElementById(windowId);
        if (window) {
            if (window.style.display === 'none') {
                window.style.display = 'flex';
                focusWindow(window);
            } else if (activeWindow === window) {
                window.style.display = 'none';
            } else {
                focusWindow(window);
            }
        }
    });
    
    taskbarItems.appendChild(taskbarItem);
}

// Create browser content for different websites
function createBrowserContent(site) {
    let content = `
        <div class="browser-toolbar">
            <div class="browser-nav">
                <div class="browser-nav-button browser-back">◀</div>
                <div class="browser-nav-button browser-forward">▶</div>
                <div class="browser-nav-button browser-refresh">↻</div>
            </div>
            <div class="browser-address">
                <span class="current-url"></span>
            </div>
        </div>
        <div class="browser-content">
    `;
    
    if (site === 'muddy-poodle') {
        content += `
            <div class="mock-page muddy-poodle">
                <div class="muddy-search">
                    <img src="muddy_poodle_logo.png" class="muddy-logo" alt="Muddy Poodle">
                    <div class="muddy-links">
                        <div class="muddy-link" data-site="peppatube">PeppaTube</div>
                        <div class="muddy-link" data-site="peppa-website">Peppa Pig Official</div>
                        <div class="muddy-link" data-site="peppacraft">Free PeppaCraft Download</div>
                        <div class="muddy-link" data-site="muddy-games">Muddy Games</div>
                    </div>
                </div>
            </div>
        `;
    } else if (site === 'peppatube') {
        content += `
            <div class="mock-page peppatube">
                <div class="peppatube-header">
                    <img src="peppatube_logo.png" class="peppatube-logo" alt="PeppaTube">
                    <div class="peppatube-search">
                        <input type="text" placeholder="Search">
                    </div>
                </div>
                <div class="peppatube-content">
                    <div class="peppatube-videos">
                        <div class="peppatube-video" data-video-id="1" data-title="Peppa Pig Goes Swimming" data-desc="Peppa and her family visit the swimming pool. Peppa loves the water!">
                            <div class="peppatube-thumbnail">
                                <img src="video_thumb1.png" alt="Video">
                            </div>
                            <div class="peppatube-details">
                                <div class="peppatube-title">Peppa Pig Goes Swimming</div>
                                <div class="peppatube-channel">Peppa Official • 2.5M views</div>
                            </div>
                        </div>
                        <div class="peppatube-video" data-video-id="2" data-title="Peppa's Muddy Puddle Adventure" data-desc="Peppa and George jump in muddy puddles after the rain. It's Peppa's favorite activity!">
                            <div class="peppatube-thumbnail">
                                <img src="video_thumb2.png" alt="Video">
                            </div>
                            <div class="peppatube-details">
                                <div class="peppatube-title">Peppa's Muddy Puddle Adventure</div>
                                <div class="peppatube-channel">Peppa Official • 1.8M views</div>
                            </div>
                        </div>
                        <div class="peppatube-video" data-video-id="3" data-title="George and Dinosaur Fun" data-desc="George plays with his favorite dinosaur toy. Dinosaur! *snort* *snort*">
                            <div class="peppatube-thumbnail">
                                <img src="video_thumb3.png" alt="Video">
                            </div>
                            <div class="peppatube-details">
                                <div class="peppatube-title">George and Dinosaur Fun</div>
                                <div class="peppatube-channel">Peppa Official • 3.2M views</div>
                            </div>
                        </div>
                        <div class="peppatube-video" data-video-id="4" data-title="Peppa's Family Holiday" data-desc="Peppa and her family go on a beach holiday. They build sandcastles and swim in the sea!">
                            <div class="peppatube-thumbnail">
                                <img src="video_thumb4.png" alt="Video">
                            </div>
                            <div class="peppatube-details">
                                <div class="peppatube-title">Peppa's Family Holiday</div>
                                <div class="peppatube-channel">Peppa Official • 4.1M views</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (site === 'peppa-website') {
        content += `
            <div class="mock-page peppa-website">
                <div class="peppa-website-header">
                    <img src="peppa_avatar.png" class="peppa-website-logo" alt="Peppa Pig">
                    <h1>Official Peppa Pig Website</h1>
                </div>
                <div class="peppa-website-content">
                    <div class="peppa-website-section">
                        <h2>Episodes</h2>
                        <div class="peppa-episodes">
                            <div class="peppa-episode">
                                <img src="video_thumb1.png" alt="Episode">
                                <div>S1E1: Muddy Puddles</div>
                            </div>
                            <div class="peppa-episode">
                                <img src="video_thumb2.png" alt="Episode">
                                <div>S1E2: Mr. Dinosaur Is Lost</div>
                            </div>
                            <div class="peppa-episode">
                                <img src="video_thumb3.png" alt="Episode">
                                <div>S1E3: Best Friend</div>
                            </div>
                            <div class="peppa-episode">
                                <img src="video_thumb4.png" alt="Episode">
                                <div>S1E4: Polly Parrot</div>
                            </div>
                        </div>
                    </div>
                    <div class="peppa-website-section">
                        <h2>Characters</h2>
                        <div class="peppa-characters">
                            <div class="peppa-character">
                                <img src="peppa_avatar.png" alt="Peppa">
                                <div>Peppa Pig</div>
                            </div>
                            <div class="peppa-character">
                                <img src="george_pig.png" alt="George">
                                <div>George Pig</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (site === 'peppacraft') {
        content += `
            <div class="mock-page peppacraft">
                <div class="peppacraft-header">
                    <h1>PeppaCraft - Free Download</h1>
                </div>
                <div class="peppacraft-content">
                    <div class="peppacraft-description">
                        <p>Build your own Peppa Pig world in this exciting game!</p>
                        <p>Features:</p>
                        <ul>
                            <li>Create muddy puddles</li>
                            <li>Build Peppa's house</li>
                            <li>Play with all your favorite characters</li>
                        </ul>
                    </div>
                    <div class="peppacraft-download">
                        <button id="peppacraft-download-btn" class="peppacraft-download-btn">DOWNLOAD NOW</button>
                        <div class="peppacraft-size">File size: 256MB</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    content += `</div>`;
    
    setTimeout(() => {
        const browserContainer = document.querySelector('.browser-content');
        if (!browserContainer) return;
        
        // Set up browser controls
        const backBtn = document.querySelector('.browser-back');
        const forwardBtn = document.querySelector('.browser-forward');
        const refreshBtn = document.querySelector('.browser-refresh');
        const addressBar = document.querySelector('.current-url');
        
        if (site === 'muddy-poodle') {
            addressBar.textContent = 'https://www.muddypoodle.com';
            
            // Add event listener to muddy poodle links
            const links = document.querySelectorAll('.muddy-link');
            if (links) {
                links.forEach(link => {
                    link.addEventListener('click', function() {
                        const linkSite = this.getAttribute('data-site');
                        const browserContent = document.querySelector('.browser-content');
                        
                        if (browserContent) {
                            if (linkSite === 'peppatube') {
                                browserContent.innerHTML = createBrowserContent('peppatube').split('<div class="browser-content">')[1].split('</div>')[0];
                                addressBar.textContent = 'https://www.peppatube.com';
                            } else if (linkSite === 'peppa-website') {
                                browserContent.innerHTML = createBrowserContent('peppa-website').split('<div class="browser-content">')[1].split('</div>')[0];
                                addressBar.textContent = 'https://www.peppapig.com';
                            } else if (linkSite === 'peppacraft') {
                                browserContent.innerHTML = createBrowserContent('peppacraft').split('<div class="browser-content">')[1].split('</div>')[0];
                                addressBar.textContent = 'https://www.peppacraft.com';
                                
                                // Add event listener to the download button
                                setTimeout(() => {
                                    const downloadBtn = document.getElementById('peppacraft-download-btn');
                                    if (downloadBtn) {
                                        downloadBtn.addEventListener('click', function() {
                                            startPeppacraftDownloadEffect();
                                        });
                                    }
                                }, 100);
                            }
                        }
                    });
                });
            }
        } else if (site === 'peppatube') {
            addressBar.textContent = 'https://www.peppatube.com';
        } else if (site === 'peppa-website') {
            addressBar.textContent = 'https://www.peppapig.com';
        } else if (site === 'peppacraft') {
            addressBar.textContent = 'https://www.peppacraft.com';
            
            // Add event listener to the download button
            const downloadBtn = document.getElementById('peppacraft-download-btn');
            if (downloadBtn) {
                downloadBtn.addEventListener('click', function() {
                    startPeppacraftDownloadEffect();
                });
            }
        }
        
        // Add navigation functionality
        backBtn.addEventListener('click', function() {
            const browserContent = document.querySelector('.browser-content');
            if (browserContent) {
                if (site === 'peppatube' || site === 'peppa-website' || site === 'peppacraft') {
                    browserContent.innerHTML = createBrowserContent('muddy-poodle').split('<div class="browser-content">')[1].split('</div>')[0];
                    addressBar.textContent = 'https://www.muddypoodle.com';
                }
            }
        });
        
        setupPeppatubeEvents();
    }, 100);
    
    return content;
}

// Create content for the photos app
function createPhotosContent() {
    return `
        <div style="padding: 20px;">
            <h2 style="margin-bottom: 20px;">Muddy Photos</h2>
            <div class="photos-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); grid-gap: 15px;">
                <img src="photo1.png" class="photo-item" data-id="photo1" style="width: 100%; height: 100px; object-fit: cover; cursor: pointer;" alt="Photo">
                <img src="photo2.png" class="photo-item" data-id="photo2" style="width: 100%; height: 100px; object-fit: cover; cursor: pointer;" alt="Photo">
                <img src="photo3.png" class="photo-item" data-id="photo3" style="width: 100%; height: 100px; object-fit: cover; cursor: pointer;" alt="Photo">
                <img src="photo4.png" class="photo-item" data-id="photo4" style="width: 100%; height: 100px; object-fit: cover; cursor: pointer;" alt="Photo">
            </div>
        </div>
    `;
}

// Create content for the store app
function createStoreContent() {
    let storeHTML = `
        <div class="store-container">
            <div class="store-header">
                <h2>Peppa Store</h2>
                <div class="store-balance">₱ <span id="store-balance">${peppaDollars}</span></div>
            </div>
            <div class="app-grid">
    `;
    
    // Add all available apps
    availableApps.forEach(app => {
        const isInstalled = installedApps.includes(app.id);
        const buttonText = isInstalled ? 'Installed' : `Buy - ₱${app.price}`;
        const buttonClass = isInstalled ? 'buy-button installed' : 'buy-button';
        const priceClass = app.price === 0 ? 'app-price free' : 'app-price';
        const priceText = app.price === 0 ? 'FREE' : `₱${app.price}`;
        
        storeHTML += `
            <div class="store-app" data-app-id="${app.id}">
                <img src="${app.icon}" alt="${app.name}">
                <div class="app-title">${app.name}</div>
                <div class="${priceClass}">${priceText}</div>
                <button class="${buttonClass}" ${isInstalled ? 'disabled' : ''} 
                    data-app-id="${app.id}" data-app-price="${app.price}">
                    ${buttonText}
                </button>
            </div>
        `;
    });
    
    storeHTML += `
            </div>
            <div class="task-container">
                <h3>Earn Peppa Dollars</h3>
                <div class="task-list">
    `;
    
    // Add tasks
    tasks.forEach(task => {
        if (!task.completed) {
            storeHTML += `
                <div class="task-item" data-task-id="${task.id}">
                    <div>${task.name}</div>
                    <div class="task-reward">₱${task.reward}</div>
                </div>
            `;
        }
    });
    
    storeHTML += `
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners after a short timeout
    setTimeout(() => {
        // Buy buttons
        document.querySelectorAll('.buy-button:not(.installed)').forEach(button => {
            button.addEventListener('click', function() {
                const appId = this.getAttribute('data-app-id');
                const appPrice = parseInt(this.getAttribute('data-app-price'));
                
                if (peppaDollars >= appPrice) {
                    // Purchase the app
                    peppaDollars -= appPrice;
                    updateCurrencyDisplay();
                    
                    // Update store balance
                    const storeBalance = document.getElementById('store-balance');
                    if (storeBalance) {
                        storeBalance.textContent = peppaDollars;
                    }
                    
                    // Mark as installed
                    installedApps.push(appId);
                    this.textContent = 'Installed';
                    this.classList.add('installed');
                    this.disabled = true;
                    
                    // Update app object
                    const appIndex = availableApps.findIndex(app => app.id === appId);
                    if (appIndex !== -1) {
                        availableApps[appIndex].installed = true;
                    }
                    
                    // Add to desktop
                    addAppToDesktop(appId);
                    
                    // Show success message
                    const assistantBubble = document.querySelector('.assistant-bubble');
                    const assistantMessage = document.querySelector('.assistant-message');
                    assistantMessage.textContent = `You bought ${getAppName(appId)}! You can find it on your desktop. *snort*`;
                    assistantBubble.style.display = 'block';
                    
                    // Hide after 3 seconds
                    setTimeout(() => {
                        assistantBubble.style.display = 'none';
                    }, 3000);
                } else {
                    // Not enough Peppa Dollars
                    const assistantBubble = document.querySelector('.assistant-bubble');
                    const assistantMessage = document.querySelector('.assistant-message');
                    assistantMessage.textContent = `You don't have enough Peppa Dollars! Try completing tasks or ask George. *snort*`;
                    assistantBubble.style.display = 'block';
                    
                    // Hide after 3 seconds
                    setTimeout(() => {
                        assistantBubble.style.display = 'none';
                    }, 3000);
                }
            });
        });
    }, 100);
    
    return storeHTML;
}

// Get app name by ID
function getAppName(appId) {
    const app = availableApps.find(app => app.id === appId);
    return app ? app.name : appId;
}

// Add an app to the desktop
function addAppToDesktop(appId) {
    const app = availableApps.find(app => app.id === appId);
    if (!app) return;
    
    const desktopIcons = document.querySelector('.desktop-icons');
    const newIcon = document.createElement('div');
    newIcon.className = 'icon';
    newIcon.setAttribute('data-app', appId);
    
    newIcon.innerHTML = `
        <img src="${app.icon}" alt="${app.name}">
        <span>${app.name}</span>
    `;
    
    newIcon.addEventListener('click', function() {
        const app = this.getAttribute('data-app');
        openApp(app);
    });
    
    desktopIcons.appendChild(newIcon);
    
    // Also add to start menu
    const startItems = document.querySelector('.start-items');
    const newStartItem = document.createElement('div');
    newStartItem.className = 'start-item';
    newStartItem.setAttribute('data-app', appId);
    
    newStartItem.innerHTML = `
        <img src="${app.icon}" alt="${app.name}">
        <span>${app.name}</span>
    `;
    
    newStartItem.addEventListener('click', function() {
        const app = this.getAttribute('data-app');
        openApp(app);
        toggleStartMenu();
    });
    
    // Insert before the shutdown button
    const shutdownBtn = document.querySelector('.start-item[data-action="shutdown"]');
    startItems.insertBefore(newStartItem, shutdownBtn);
}

// Update currency display
function updateCurrencyDisplay() {
    const currencyAmount = document.getElementById('currency-amount');
    if (currencyAmount) {
        currencyAmount.textContent = peppaDollars;
    }
    
    // Also update in store if open
    const storeBalance = document.getElementById('store-balance');
    if (storeBalance) {
        storeBalance.textContent = peppaDollars;
    }
}

// Initialize George interaction
function initGeorge() {
    const george = document.querySelector('.george-pig');
    const georgeBubble = document.querySelector('.george-bubble');
    const georgeYesBtn = document.getElementById('george-yes');
    const georgeNoBtn = document.getElementById('george-no');
    
    // Show George's bubble when clicked
    george.addEventListener('click', function() {
        georgeBubble.style.display = georgeBubble.style.display === 'block' ? 'none' : 'block';
    });
    
    // George gives Peppa Dollars
    georgeYesBtn.addEventListener('click', function() {
        const amount = Math.floor(Math.random() * 10) + 1; // Random 1-10 Peppa Dollars
        peppaDollars += amount;
        updateCurrencyDisplay();
        
        // Update George's message
        const georgeMessage = document.querySelector('.george-message');
        georgeMessage.textContent = `Dinosaur! *snort* Here's ₱${amount} for you!`;
        
        // Hide buttons
        document.querySelector('.george-buttons').style.display = 'none';
        
        // Reset after a few seconds
        setTimeout(() => {
            georgeBubble.style.display = 'none';
            
            // Reset message and show buttons again after hiding
            setTimeout(() => {
                georgeMessage.textContent = "Dinosaur! *snort* Give me Peppa Dollars?";
                document.querySelector('.george-buttons').style.display = 'flex';
            }, 500);
        }, 2000);
    });
    
    // George says no
    georgeNoBtn.addEventListener('click', function() {
        // Update George's message
        const georgeMessage = document.querySelector('.george-message');
        georgeMessage.textContent = "Dinosaur... *sad snort*";
        
        // Hide buttons
        document.querySelector('.george-buttons').style.display = 'none';
        
        // Reset after a few seconds
        setTimeout(() => {
            georgeBubble.style.display = 'none';
            
            // Reset message and show buttons again after hiding
            setTimeout(() => {
                georgeMessage.textContent = "Dinosaur! *snort* Give me Peppa Dollars?";
                document.querySelector('.george-buttons').style.display = 'flex';
            }, 500);
        }, 2000);
    });
}

// Complete a task by ID
function completeTask(taskId) {
    const task = tasks.find(task => task.id === taskId);
    if (task && !task.completed) {
        task.completed = true;
        peppaDollars += task.reward;
        updateCurrencyDisplay();
        
        // Show confirmation
        const assistantBubble = document.querySelector('.assistant-bubble');
        const assistantMessage = document.querySelector('.assistant-message');
        assistantMessage.textContent = `You completed a task! You earned ₱${task.reward}! *snort*`;
        assistantBubble.style.display = 'block';
        
        // Hide after 3 seconds
        setTimeout(() => {
            assistantBubble.style.display = 'none';
        }, 3000);
        
        // Update task list in store if open
        const taskItem = document.querySelector(`.task-item[data-task-id="${taskId}"]`);
        if (taskItem) {
            taskItem.remove();
        }
    }
}

// Shutdown function
function shutdown() {
    document.body.innerHTML = `
        <div style="height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #000;">
            <img src="peppa_avatar.png" style="width: 100px; height: 100px; margin-bottom: 20px;">
            <div style="color: white; font-size: 24px;">Shutting down...</div>
        </div>
    `;
    
    setTimeout(() => {
        document.body.innerHTML = `
            <div style="height: 100vh; display: flex; justify-content: center; align-items: center; background-color: #000; color: white; font-size: 32px;">
                <button onclick="location.reload()" style="padding: 10px 20px; font-size: 18px; cursor: pointer;">Restart</button>
            </div>
        `;
    }, 2000);
}

// Initialize Peppa Assistant
function initPeppaAssistant() {
    const assistant = document.querySelector('.peppa-assistant');
    const bubble = document.querySelector('.assistant-bubble');
    const messageDiv = document.querySelector('.assistant-message');
    const input = document.getElementById('assistant-query');
    const sendBtn = document.getElementById('assistant-send');
    
    // Show random tips every 30 seconds
    const tips = [
        "Try clicking on photos in Muddy Photos to set them as wallpaper!",
        "You can ask me to open apps for you. Try saying 'open PeppaTube'",
        "I love jumping in muddy puddles! What do you like to do?",
        "Click the start button to see all available apps!",
        "Need help with anything? Just ask me!"
    ];
    
    // Show bubble when clicking on Peppa
    assistant.addEventListener('click', function() {
        bubble.style.display = bubble.style.display === 'block' ? 'none' : 'block';
        // Complete task for clicking Peppa Assistant
        completeTask(1);
    });
    
    // Process user input
    function processQuery() {
        const query = input.value.trim().toLowerCase();
        if (!query) return;
        
        let response = "I'm not sure how to help with that.";
        
        // Check for app opening commands
        if (query.includes('open')) {
            if (query.includes('peppatube') || query.includes('youtube')) {
                response = "Opening PeppaTube for you!";
                setTimeout(() => openApp('peppatube'), 500);
            } else if (query.includes('browser') || query.includes('muddy poodle') || query.includes('google')) {
                response = "Opening Muddy Poodle browser!";
                setTimeout(() => openApp('browser'), 500);
            } else if (query.includes('notes') || query.includes('oink notes')) {
                response = "Opening Oink Notes!";
                setTimeout(() => openApp('notes'), 500);
            } else if (query.includes('photos') || query.includes('muddy photos')) {
                response = "Opening Muddy Photos!";
                setTimeout(() => openApp('photos'), 500);
            } else {
                response = "I'm not sure which app you want to open.";
            }
        } else if (query.includes('hello') || query.includes('hi')) {
            response = "Hello! I'm Peppa Pig! *snort* How can I help you today?";
        } else if (query.includes('help')) {
            response = "I can help you open apps! Try saying 'open PeppaTube' or 'open browser'.";
        } else if (query.includes('thank')) {
            response = "You're welcome! *snort*";
        } else if (query.includes('muddy puddle') || query.includes('jump')) {
            response = "I love jumping in muddy puddles! *splash splash*";
        } else {
            // Using LLM for more advanced responses
            handleAIResponse(query);
            return;
        }
        
        messageDiv.textContent = response;
        input.value = '';
    }
    
    async function handleAIResponse(query) {
        messageDiv.textContent = "Thinking...";
        
        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are Peppa Pig, a friendly cartoon character. Keep responses short, cheerful, and end with a *snort* sound occasionally. Speak as if you're talking to a child."
                    },
                    {
                        role: "user",
                        content: query
                    }
                ]
            });
            
            messageDiv.textContent = completion.content;
        } catch (error) {
            messageDiv.textContent = "Oops! I got confused for a moment. *snort*";
        }
        
        input.value = '';
    }
    
    // Handle send button click
    sendBtn.addEventListener('click', processQuery);
    
    // Handle enter key press
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            processQuery();
        }
    });
    
    // Show random tips
    function showRandomTip() {
        if (bubble.style.display !== 'block') {
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            bubble.style.display = 'block';
            messageDiv.textContent = randomTip;
            
            // Hide after 5 seconds
            setTimeout(() => {
                bubble.style.display = 'none';
            }, 5000);
        }
    }
    
    // Show first tip after 10 seconds
    setTimeout(showRandomTip, 10000);
    
    // Show tips periodically
    setInterval(showRandomTip, 60000);
}

// Initialize Photo Context Menu
function initPhotoContextMenu() {
    const contextMenu = document.getElementById('photo-context-menu');
    const setAsWallpaperBtn = document.getElementById('set-as-wallpaper');
    const deletePhotoBtn = document.getElementById('delete-photo');
    const hideMenuBtn = document.getElementById('hide-menu');
    
    let currentPhotoElement = null;
    
    // Add click event listeners to photos after they're loaded
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('photo-item')) {
            e.preventDefault();
            
            // Position context menu at click position
            contextMenu.style.left = e.pageX + 'px';
            contextMenu.style.top = e.pageY + 'px';
            contextMenu.style.display = 'block';
            
            // Store reference to the clicked photo
            currentPhotoElement = e.target;
        } else if (!e.target.closest('#photo-context-menu')) {
            // Hide context menu when clicking elsewhere
            contextMenu.style.display = 'none';
        }
    });
    
    // Set as wallpaper
    setAsWallpaperBtn.addEventListener('click', function() {
        if (currentPhotoElement) {
            const photoSrc = currentPhotoElement.src;
            document.querySelector('.desktop').style.backgroundImage = `url('${photoSrc}')`;
            contextMenu.style.display = 'none';
            
            // Show confirmation via Peppa assistant
            const assistantBubble = document.querySelector('.assistant-bubble');
            const assistantMessage = document.querySelector('.assistant-message');
            assistantMessage.textContent = "Wallpaper changed! How does it look? *snort*";
            assistantBubble.style.display = 'block';
            
            // Complete task for changing wallpaper
            completeTask(2);
            
            // Hide after 3 seconds
            setTimeout(() => {
                assistantBubble.style.display = 'none';
            }, 3000);
        }
    });
    
    // Delete photo
    deletePhotoBtn.addEventListener('click', function() {
        if (currentPhotoElement) {
            // Just hide the photo (we're not actually deleting files)
            currentPhotoElement.style.display = 'none';
            contextMenu.style.display = 'none';
            
            // Show confirmation
            const assistantBubble = document.querySelector('.assistant-bubble');
            const assistantMessage = document.querySelector('.assistant-message');
            assistantMessage.textContent = "Photo deleted! *snort*";
            assistantBubble.style.display = 'block';
            
            // Hide after 3 seconds
            setTimeout(() => {
                assistantBubble.style.display = 'none';
            }, 3000);
        }
    });
    
    // Hide menu
    hideMenuBtn.addEventListener('click', function() {
        contextMenu.style.display = 'none';
    });
}

// Create settings content
function createSettingsContent() {
    let content = `
        <div class="settings-container">
            <h2>Peppa Pig OS Settings</h2>
            
            <div class="settings-section">
                <h3>Wallpaper</h3>
                <div class="wallpaper-options">
                    <div class="wallpaper-option" data-wallpaper="wallpaper.png">
                        <img src="wallpaper.png" alt="Default Wallpaper">
                        <span>Default</span>
                    </div>
                    <div class="wallpaper-option" data-wallpaper="photo1.png">
                        <img src="photo1.png" alt="Peppa's House">
                        <span>Peppa's House</span>
                    </div>
                    <div class="wallpaper-option" data-wallpaper="photo2.png">
                        <img src="photo2.png" alt="Muddy Puddles">
                        <span>Muddy Puddles</span>
                    </div>
                    <div class="wallpaper-option" data-wallpaper="photo3.png">
                        <img src="photo3.png" alt="Picnic">
                        <span>Family Picnic</span>
                    </div>
                    <div class="wallpaper-option" data-wallpaper="photo4.png">
                        <img src="photo4.png" alt="School">
                        <span>School</span>
                    </div>
                </div>
            </div>
            
            <div class="settings-section danger-zone">
                <h3>Danger Zone</h3>
                <p class="warning-text">Warning: This action cannot be undone!</p>
                <button id="delete-os-btn" class="delete-os-btn">Delete Peppa Pig OS</button>
            </div>
        </div>
    `;
    
    // Add event listeners after content is added to DOM
    setTimeout(() => {
        // Wallpaper options
        document.querySelectorAll('.wallpaper-option').forEach(option => {
            option.addEventListener('click', function() {
                const wallpaper = this.getAttribute('data-wallpaper');
                document.querySelector('.desktop').style.backgroundImage = `url('${wallpaper}')`;
                
                // Add selected class
                document.querySelectorAll('.wallpaper-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                this.classList.add('selected');
                
                // Show confirmation via Peppa assistant
                const assistantBubble = document.querySelector('.assistant-bubble');
                const assistantMessage = document.querySelector('.assistant-message');
                assistantMessage.textContent = "Wallpaper changed! How does it look? *snort*";
                assistantBubble.style.display = 'block';
                
                // Complete task for changing wallpaper
                completeTask(2);
                
                // Hide after 3 seconds
                setTimeout(() => {
                    assistantBubble.style.display = 'none';
                }, 3000);
            });
        });
        
        // Delete OS button
        const deleteButton = document.getElementById('delete-os-btn');
        if (deleteButton) {
            deleteButton.addEventListener('click', function() {
                if (confirm("Are you sure you want to delete Peppa Pig OS? This action cannot be undone!")) {
                    startBlackHoleAnimation();
                }
            });
        }
    }, 100);
    
    return content;
}

// Create Pigcraft content
function createPigcraftContent() {
    return `
        <div class="pigcraft-container">
            <div class="minecraft-title-screen">
                <div class="minecraft-logo">
                    <h1>PIGCRAFT</h1>
                </div>
                <div class="minecraft-buttons">
                    <button class="minecraft-button" id="minecraft-start">Start Game</button>
                    <button class="minecraft-button">Options</button>
                    <button class="minecraft-button">Quit Game</button>
                </div>
                <div class="minecraft-version">Peppa Pig Edition v1.0</div>
            </div>
            
            <div class="minecraft-game-screen" style="display: none;">
                <div class="minecraft-hud">
                    <div class="minecraft-health">❤️❤️❤️❤️❤️</div>
                    <div class="minecraft-hunger">🍝🍝🍝🍝🍝</div>
                </div>
                <div class="minecraft-world">
                    <div class="minecraft-message">You dig around and find some mud! *oink*</div>
                </div>
                <div class="minecraft-inventory-bar">
                    <div class="inventory-slot selected">🧱</div>
                    <div class="inventory-slot">🪓</div>
                    <div class="inventory-slot">⛏️</div>
                    <div class="inventory-slot">🗡️</div>
                    <div class="inventory-slot">🐖</div>
                    <div class="inventory-slot">🥕</div>
                    <div class="inventory-slot">🌲</div>
                    <div class="inventory-slot">💧</div>
                    <div class="inventory-slot">🧪</div>
                </div>
            </div>
        </div>
    `;
}

// Black hole animation
function startBlackHoleAnimation() {
    // Close all windows
    const windows = document.querySelectorAll('.window');
    windows.forEach(window => {
        window.remove();
    });
    
    // Hide taskbar and start menu
    document.querySelector('.taskbar').style.display = 'none';
    document.getElementById('start-menu').style.display = 'none';
    
    // Show black hole
    const blackHoleContainer = document.getElementById('black-hole-container');
    blackHoleContainer.style.display = 'flex';
    
    // Start the animation
    setTimeout(() => {
        blackHoleContainer.classList.add('active');
        
        // Make desktop icons get sucked in
        const icons = document.querySelectorAll('.icon');
        icons.forEach((icon, index) => {
            setTimeout(() => {
                icon.classList.add('sucked-in');
            }, index * 200);
        });
        
        // Show angry Peppa after icons are sucked in
        setTimeout(() => {
            const angryPeppa = document.querySelector('.angry-peppa-container');
            angryPeppa.style.display = 'flex';
            
            // Hide assistant and George
            document.querySelector('.peppa-assistant').style.display = 'none';
            document.querySelector('.george-container').style.display = 'none';
            
            // Show pink screen of death after a few seconds
            setTimeout(() => {
                document.getElementById('pink-screen').style.display = 'flex';
                blackHoleContainer.style.display = 'none';
            }, 4000);
        }, icons.length * 200 + 1000);
    }, 1000);
}

// Add the FNAPP warning function
function showFNAPPWarning() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '10000';
    
    // Create warning box
    const warningBox = document.createElement('div');
    warningBox.style.width = '400px';
    warningBox.style.backgroundColor = '#f5a9c7';
    warningBox.style.borderRadius = '10px';
    warningBox.style.padding = '20px';
    warningBox.style.textAlign = 'center';
    warningBox.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
    
    warningBox.innerHTML = `
        <h2 style="margin-bottom: 15px;">WARNING!</h2>
        <img src="peppa_angry.png" style="width: 100px; margin-bottom: 15px;">
        <p style="margin-bottom: 20px;">This game may be scary for little piggies! Are you sure you want to continue?</p>
        <div style="display: flex; justify-content: space-around;">
            <button id="fnapp-cancel" style="padding: 10px 20px; background-color: #ddd; border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
            <button id="fnapp-continue" style="padding: 10px 20px; background-color: #ff4444; color: white; border: none; border-radius: 5px; cursor: pointer;">Continue</button>
        </div>
    `;
    
    modal.appendChild(warningBox);
    document.body.appendChild(modal);
    
    // Add event listeners
    document.getElementById('fnapp-cancel').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    document.getElementById('fnapp-continue').addEventListener('click', function() {
        document.body.removeChild(modal);
        createFNAPPWindow();
    });
}

// Create the FNAPP window
function createFNAPPWindow() {
    const title = "Five Nights at Peppa Pig";
    const content = createFNAPPContent();
    createWindow('fnapp', title, content);
}

// Create FNAPP content
function createFNAPPContent() {
    return `
        <div class="fnapp-container" style="width: 100%; height: 100%; background-color: #111; color: white; position: relative; overflow: hidden;">
            <div class="fnapp-office" style="width: 100%; height: 100%; background-image: url('photo1.png'); background-size: cover; filter: brightness(0.3) sepia(0.5); display: flex; flex-direction: column; justify-content: space-between;">
                <div class="fnapp-header" style="padding: 10px; display: flex; justify-content: space-between;">
                    <div class="fnapp-night">Night 1</div>
                    <div class="fnapp-time">12 AM</div>
                    <div class="fnapp-power">Power: 100%</div>
                </div>
                
                <div class="fnapp-controls" style="padding: 15px; display: flex; justify-content: space-between;">
                    <div class="fnapp-cameras">
                        <button class="fnapp-button" id="fnapp-camera-btn" style="padding: 8px 15px; background-color: #f5a9c7; border: none; color: white;">Cameras</button>
                    </div>
                    <div class="fnapp-doors">
                        <button class="fnapp-button" id="fnapp-left-door" style="padding: 8px 15px; background-color: #555; border: none; color: white; margin-right: 10px;">Left Door</button>
                        <button class="fnapp-button" id="fnapp-right-door" style="padding: 8px 15px; background-color: #555; border: none; color: white;">Right Door</button>
                    </div>
                </div>
            </div>
            
            <div class="fnapp-camera-view" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: #000; display: none;">
                <div class="fnapp-camera-header" style="padding: 10px; display: flex; justify-content: space-between;">
                    <div class="fnapp-cam-label">CAM 1</div>
                    <button class="fnapp-button" id="fnapp-exit-cam" style="padding: 5px 10px; background-color: #f5a9c7; border: none; color: white;">Exit Camera</button>
                </div>
                <div class="fnapp-cam-content" style="height: calc(100% - 50px); display: flex; justify-content: center; align-items: center;">
                    <img src="photo4.png" style="max-width: 80%; max-height: 80%; filter: grayscale(1) brightness(0.7) contrast(1.2);">
                </div>
            </div>
            
            <div class="fnapp-jumpscare" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: #000; display: none; justify-content: center; align-items: center;">
                <img src="peppa_angry.png" style="width: 80%; height: auto; animation: shake 0.5s infinite;">
            </div>
            
            <style>
                @keyframes shake {
                    0% { transform: translate(0, 0) scale(1); }
                    10% { transform: translate(-10px, 0) scale(1.05); }
                    20% { transform: translate(10px, 0) scale(1.1); }
                    30% { transform: translate(-10px, 0) scale(1.15); }
                    40% { transform: translate(10px, 0) scale(1.2); }
                    50% { transform: translate(-10px, 0) scale(1.15); }
                    60% { transform: translate(10px, 0) scale(1.1); }
                    70% { transform: translate(-10px, 0) scale(1.05); }
                    80% { transform: translate(10px, 0) scale(1); }
                    90% { transform: translate(-10px, 0) scale(0.95); }
                    100% { transform: translate(0, 0) scale(1); }
                }
            </style>
        </div>
    `;
}

// Add this to the end of setupPigcraftEvents() or create a new function for FNAPP events
function setupFNAPPEvents() {
    const cameraBtn = document.getElementById('fnapp-camera-btn');
    const exitCamBtn = document.getElementById('fnapp-exit-cam');
    const leftDoorBtn = document.getElementById('fnapp-left-door');
    const rightDoorBtn = document.getElementById('fnapp-right-door');
    
    if (cameraBtn) {
        cameraBtn.addEventListener('click', function() {
            document.querySelector('.fnapp-camera-view').style.display = 'block';
        });
    }
    
    if (exitCamBtn) {
        exitCamBtn.addEventListener('click', function() {
            document.querySelector('.fnapp-camera-view').style.display = 'none';
        });
    }
    
    if (leftDoorBtn) {
        leftDoorBtn.addEventListener('click', function() {
            this.style.backgroundColor = this.style.backgroundColor === 'rgb(85, 85, 85)' ? '#f5a9c7' : '#555';
        });
    }
    
    if (rightDoorBtn) {
        rightDoorBtn.addEventListener('click', function() {
            this.style.backgroundColor = this.style.backgroundColor === 'rgb(85, 85, 85)' ? '#f5a9c7' : '#555';
            
            // 20% chance of jumpscare when toggling right door
            if (Math.random() < 0.2) {
                setTimeout(() => {
                    document.querySelector('.fnapp-jumpscare').style.display = 'flex';
                    
                    // Hide jumpscare after 2 seconds
                    setTimeout(() => {
                        document.querySelector('.fnapp-jumpscare').style.display = 'none';
                    }, 2000);
                }, 500);
            }
        });
    }
}

// Create content for the calendar app
function createCalendarContent() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    let calendarHTML = `
        <div class="calendar-container">
            <div class="calendar-header">
                <div class="calendar-title">Piggy Calendar</div>
                <div class="calendar-navigation">
                    <button class="calendar-nav-btn prev-month">◀</button>
                    <div class="month-display">${months[currentMonth]} ${currentYear}</div>
                    <button class="calendar-nav-btn next-month">▶</button>
                </div>
            </div>
            <div class="calendar-grid">
    `;
    
    // Add day headers
    days.forEach(day => {
        calendarHTML += `<div class="calendar-day-header">${day}</div>`;
    });
    
    // Get first day of the month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startingDay = firstDay.getDay();
    
    // Get last day of the month
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
    
    // Get days from previous month to fill first week
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
        calendarHTML += `
            <div class="calendar-day other-month">
                <div class="calendar-day-number">${prevMonthLastDay - i}</div>
            </div>
        `;
    }
    
    // Current month days
    const today = now.getDate();
    for (let i = 1; i <= totalDays; i++) {
        const isToday = i === today;
        calendarHTML += `
            <div class="calendar-day ${isToday ? 'today' : ''}">
                <div class="calendar-day-number">${i}</div>
                ${i === 15 ? '<div class="calendar-event">Peppa\'s Birthday Party</div>' : ''}
                ${i === 22 ? '<div class="calendar-event">Muddy Puddles Day</div>' : ''}
            </div>
        `;
    }
    
    // Fill remaining slots with next month
    const remainingSlots = 42 - (startingDay + totalDays);
    for (let i = 1; i <= remainingSlots; i++) {
        calendarHTML += `
            <div class="calendar-day other-month">
                <div class="calendar-day-number">${i}</div>
            </div>
        `;
    }
    
    calendarHTML += `
            </div>
        </div>
    `;
    
    // Add event listeners after a short timeout
    setTimeout(() => {
        const prevMonthBtn = document.querySelector('.prev-month');
        const nextMonthBtn = document.querySelector('.next-month');
        
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', function() {
                // In a real app, this would update the calendar to show the previous month
                alert('This would show the previous month in a real calendar app!');
            });
        }
        
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', function() {
                // In a real app, this would update the calendar to show the next month
                alert('This would show the next month in a real calendar app!');
            });
        }
    }, 100);
    
    return calendarHTML;
}

// Create content for the music app
function createMusicContent() {
    let musicHTML = `
        <div class="music-player">
            <div class="music-player-header">
                <h2>Peppa Music</h2>
                <p>Listen to your favorite Peppa Pig tunes!</p>
            </div>
            
            <div class="music-controls">
                <button class="music-control-btn" id="music-prev">◀</button>
                <button class="music-control-btn" id="music-play">▶</button>
                <button class="music-control-btn" id="music-next">▶</button>
            </div>
            
            <div class="music-progress">
                <div class="music-progress-bar"></div>
            </div>
            
            <div class="song-list">
                <div class="song-item active" data-song="peppa-pig-intro.mp3">
                    <div class="song-info">
                        <div class="song-thumbnail">🎵</div>
                        <div>
                            <div class="song-title">Peppa Pig Theme</div>
                            <div class="song-artist">Peppa Official</div>
                        </div>
                    </div>
                    <div class="song-duration">0:45</div>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners after content is added to DOM
    setTimeout(() => {
        const playBtn = document.getElementById('music-play');
        const prevBtn = document.getElementById('music-prev');
        const nextBtn = document.getElementById('music-next');
        const progressBar = document.querySelector('.music-progress-bar');
        const audioElement = document.getElementById('peppa-intro');
        let isPlaying = false;
        
        if (playBtn && audioElement) {
            playBtn.addEventListener('click', function() {
                if (isPlaying) {
                    audioElement.pause();
                    this.innerHTML = '▶';
                    isPlaying = false;
                } else {
                    audioElement.play();
                    this.innerHTML = '⏸';
                    isPlaying = true;
                    
                    // Update progress bar
                    const updateProgress = () => {
                        const progress = (audioElement.currentTime / audioElement.duration) * 100;
                        if (progressBar) {
                            progressBar.style.width = progress + '%';
                        }
                        
                        if (isPlaying) {
                            requestAnimationFrame(updateProgress);
                        }
                    };
                    
                    updateProgress();
                }
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                // In a real app with multiple songs, this would play the previous song
                alert('This is the only song available!');
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                // In a real app with multiple songs, this would play the next song
                alert('This is the only song available!');
            });
        }
        
        // Reset play button when audio ends
        if (audioElement) {
            audioElement.addEventListener('ended', function() {
                if (playBtn) {
                    playBtn.innerHTML = '▶';
                    isPlaying = false;
                }
                if (progressBar) {
                    progressBar.style.width = '0%';
                }
            });
        }
    }, 100);
    
    return musicHTML;
}

// Create content for the games app
function createGamesContent() {
    return `
        <div class="games-container">
            <div class="games-header">
                <h2>Piggy Games</h2>
                <p>Play fun games with Peppa and friends!</p>
            </div>
            
            <div class="games-grid">
                <div class="game-card">
                    <img src="peppa_avatar.png" class="game-icon" alt="Muddy Puddle Jump">
                    <div class="game-title">Muddy Puddle Jump</div>
                    <div class="game-description">Help Peppa jump in as many muddy puddles as possible!</div>
                </div>
                
                <div class="game-card">
                    <img src="george_pig.png" class="game-icon" alt="Dinosaur Hunt">
                    <div class="game-title">Dinosaur Hunt</div>
                    <div class="game-description">Help George find his lost dinosaur!</div>
                </div>
                
                <div class="game-card">
                    <img src="peppa_store_icon.png" class="game-icon" alt="Peppa's Supermarket">
                    <div class="game-title">Peppa's Supermarket</div>
                    <div class="game-description">Help Peppa shop for groceries!</div>
                </div>
                
                <div class="game-card">
                    <img src="peppa_avatar.png" class="game-icon" alt="Oink Puzzle">
                    <div class="game-title">Oink Puzzle</div>
                    <div class="game-description">Solve fun puzzles with Peppa and friends!</div>
                </div>
            </div>
        </div>
    `;
}

// Create content for the paint app
function createPaintContent() {
    let paintHTML = `
        <div class="paint-container">
            <div class="paint-toolbar">
                <div class="paint-color-picker">
                    <div class="paint-color selected" style="background-color: #000000;" data-color="#000000"></div>
                    <div class="paint-color" style="background-color: #ff0000;" data-color="#ff0000"></div>
                    <div class="paint-color" style="background-color: #00ff00;" data-color="#00ff00"></div>
                    <div class="paint-color" style="background-color: #0000ff;" data-color="#0000ff"></div>
                    <div class="paint-color" style="background-color: #ffff00;" data-color="#ffff00"></div>
                    <div class="paint-color" style="background-color: #f5a9c7;" data-color="#f5a9c7"></div>
                </div>
                
                <div class="paint-size-picker">
                    <div class="paint-size selected" data-size="2">Small</div>
                    <div class="paint-size" data-size="5">Medium</div>
                    <div class="paint-size" data-size="10">Large</div>
                </div>
                
                <button class="paint-clear">Clear</button>
            </div>
            
            <div class="paint-canvas-container">
                <canvas class="paint-canvas" width="800" height="600"></canvas>
            </div>
        </div>
    `;
    
    // Initialize canvas and drawing functionality after content is added
    setTimeout(() => {
        const canvas = document.querySelector('.paint-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let currentColor = '#000000';
        let currentSize = 2;
        
        // Resize canvas to fit container
        function resizeCanvas() {
            const container = canvas.parentElement;
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Drawing functions
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        
        function startDrawing(e) {
            isDrawing = true;
            draw(e);
        }
        
        function draw(e) {
            if (!isDrawing) return;
            
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ctx.lineWidth = currentSize;
            ctx.lineCap = 'round';
            ctx.strokeStyle = currentColor;
            
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
        
        function stopDrawing() {
            isDrawing = false;
            ctx.beginPath();
        }
        
        // Color picker
        document.querySelectorAll('.paint-color').forEach(colorEl => {
            colorEl.addEventListener('click', function() {
                document.querySelectorAll('.paint-color').forEach(el => el.classList.remove('selected'));
                this.classList.add('selected');
                currentColor = this.getAttribute('data-color');
            });
        });
        
        // Size picker
        document.querySelectorAll('.paint-size').forEach(sizeEl => {
            sizeEl.addEventListener('click', function() {
                document.querySelectorAll('.paint-size').forEach(el => el.classList.remove('selected'));
                this.classList.add('selected');
                currentSize = parseInt(this.getAttribute('data-size'));
            });
        });
        
        // Clear button
        const clearBtn = document.querySelector('.paint-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            });
        }
    }, 100);
    
    return paintHTML;
}

// Create content for the stories app
function createStoriesContent() {
    return `
        <div style="padding: 20px; height: 100%; overflow: auto;">
            <h2>Bedtime Stories</h2>
            <p>Enjoy these fun stories featuring Peppa and friends!</p>
            
            <div style="margin-top: 20px;">
                <div style="background-color: white; border-radius: 10px; padding: 15px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <h3>Peppa's Muddy Adventure</h3>
                    <p>Once upon a time, Peppa and George were playing in the garden. It had been raining, and there were lots of muddy puddles...</p>
                    <button style="background-color: #f5a9c7; color: white; border: none; padding: 5px 10px; border-radius: 5px; margin-top: 10px;">Read Story</button>
                </div>
                
                <div style="background-color: white; border-radius: 10px; padding: 15px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <h3>George and Mr. Dinosaur</h3>
                    <p>George loved his dinosaur toy more than anything. One day, while playing in the garden, he lost it...</p>
                    <button style="background-color: #f5a9c7; color: white; border: none; padding: 5px 10px; border-radius: 5px; margin-top: 10px;">Read Story</button>
                </div>
                
                <div style="background-color: white; border-radius: 10px; padding: 15px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <h3>Peppa's Birthday Party</h3>
                    <p>It was Peppa's birthday, and she was very excited. Mummy Pig and Daddy Pig had organized a special party...</p>
                    <button style="background-color: #f5a9c7; color: white; border: none; padding: 5px 10px; border-radius: 5px; margin-top: 10px;">Read Story</button>
                </div>
            </div>
        </div>
    `;
}

// Create content for the weather app
function createWeatherContent() {
    return `
        <div style="padding: 20px; height: 100%; overflow: auto;">
            <h2>Piggy Weather</h2>
            
            <div style="background-color: #f5a9c7; color: white; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center;">
                <h3>Today's Weather</h3>
                <div style="font-size: 48px; margin: 10px 0;">☀️</div>
                <div style="font-size: 24px; font-weight: bold;">25°C</div>
                <div>Perfect for jumping in muddy puddles!</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 15px;">
                <div style="background-color: white; border-radius: 10px; padding: 15px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <div>Monday</div>
                    <div style="font-size: 24px;">☀️</div>
                    <div>24°C</div>
                </div>
                
                <div style="background-color: white; border-radius: 10px; padding: 15px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <div>Tuesday</div>
                    <div style="font-size: 24px;">🌤️</div>
                    <div>22°C</div>
                </div>
                
                <div style="background-color: white; border-radius: 10px; padding: 15px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <div>Wednesday</div>
                    <div style="font-size: 24px;">🌧️</div>
                    <div>19°C</div>
                </div>
                
                <div style="background-color: white; border-radius: 10px; padding: 15px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <div>Thursday</div>
                    <div style="font-size: 24px;">🌧️</div>
                    <div>18°C</div>
                </div>
                
                <div style="background-color: white; border-radius: 10px; padding: 15px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <div>Friday</div>
                    <div style="font-size: 24px;">⛅</div>
                    <div>20°C</div>
                </div>
            </div>
        </div>
    `;
}

// Create content for the recipes app
function createRecipesContent() {
    return `
        <div style="padding: 20px; height: 100%; overflow: auto;">
            <h2>Pig Recipes</h2>
            <p>Delicious recipes that Peppa and her family enjoy!</p>
            
            <div style="margin-top: 20px;">
                <div style="background-color: white; border-radius: 10px; padding: 15px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <h3>Daddy Pig's Pancakes</h3>
                    <p><strong>Ingredients:</strong> Flour, eggs, milk, butter</p>
                    <p><strong>Instructions:</strong> Mix flour, eggs, and milk. Melt butter in a pan. Pour mixture into the pan and cook until golden. Serve with maple syrup or jam!</p>
                </div>
                
                <div style="background-color: white; border-radius: 10px; padding: 15px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <h3>Peppa's Favorite Spaghetti</h3>
                    <p><strong>Ingredients:</strong> Spaghetti, tomato sauce, cheese</p>
                    <p><strong>Instructions:</strong> Boil spaghetti until cooked. Heat tomato sauce in a pan. Mix spaghetti and sauce. Sprinkle cheese on top. Oink delicious!</p>
                </div>
                
                <div style="background-color: white; border-radius: 10px; padding: 15px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <h3>Muddy Puddle Chocolate Cake</h3>
                    <p><strong>Ingredients:</strong> Chocolate, flour, sugar, eggs, butter</p>
                    <p><strong>Instructions:</strong> Mix all ingredients. Pour into a cake tin. Bake for 30 minutes. Decorate with chocolate frosting to look like a muddy puddle!</p>
                </div>
            </div>
        </div>
    `;
}

// Create content for the chat app
function createChatContent() {
    return `
        <div style="display: flex; flex-direction: column; height: 100%;">
            <div style="background-color: #f5a9c7; color: white; padding: 10px; display: flex; align-items: center;">
                <img src="peppa_avatar.png" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
                <div style="font-weight: bold;">Oink Chat</div>
            </div>
            
            <div style="flex-grow: 1; display: flex;">
                <div style="width: 30%; border-right: 1px solid #ddd; padding: 10px; overflow-y: auto;">
                    <div style="font-weight: bold; margin-bottom: 10px;">Quick Access</div>
                    
                    <div class="file-item">
                        <img src="peppa_avatar.png" alt="Documents">
                        Documents
                    </div>
                    <div class="file-item">
                        <img src="photos_icon.png" alt="Pictures">
                        Pictures
                    </div>
                    <div class="file-item">
                        <img src="music_icon.png" alt="Music">
                        Music
                    </div>
                    <div class="file-item">
                        <img src="peppatube_icon.png" alt="Videos">
                        Videos
                    </div>
                </div>
                <div style="flex-grow: 1; padding: 20px; display: flex; flex-direction: column;">
                    <div style="padding: 10px; border-bottom: 1px solid #ddd; display: flex; align-items: center;">
                        <img src="peppa_avatar.png" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;">
                        <div>
                            <div style="font-weight: bold;">Peppa Pig</div>
                            <div style="font-size: 12px; color: #777;">Typing...</div>
                        </div>
                    </div>
                    
                    <div style="flex-grow: 1; padding: 20px; overflow-y: auto; background-color: #f9f9f9;">
                        <div class="chat-message" style="max-width: 70%; margin-bottom: 15px; align-self: flex-start;">
                            <div style="background-color: white; border-radius: 10px; padding: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                                Hello! How are you today? I'm going to jump in muddy puddles later!
                            </div>
                            <div style="font-size: 12px; color: #777; margin-top: 5px;">10:30 AM</div>
                        </div>
                        
                        <div class="chat-message" style="max-width: 70%; margin-bottom: 15px; margin-left: auto;">
                            <div style="background-color: #f5a9c7; color: white; border-radius: 10px; padding: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                                Hi Peppa! I'm good, thanks. Can I join you jumping in muddy puddles?
                            </div>
                            <div style="font-size: 12px; color: #777; margin-top: 5px; text-align: right;">10:32 AM</div>
                        </div>
                        
                        <div class="chat-message" style="max-width: 70%; margin-bottom: 15px; align-self: flex-start;">
                            <div style="background-color: white; border-radius: 10px; padding: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                                Of course! The more the merrier! *snort*
                            </div>
                            <div style="font-size: 12px; color: #777; margin-top: 5px;">10:33 AM</div>
                        </div>
                    </div>
                    
                    <div style="padding: 10px; display: flex;">
                        <input type="text" placeholder="Type a message..." style="flex-grow: 1; background-color: #000; color: #0f0; border: none; outline: none; font-family: monospace;">
                        <button style="background-color: #f5a9c7; color: white; border: none; border-radius: 20px; padding: 0 15px;">Send</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Create content for the Peppablox app
function createPeppabloxContent() {
    return `
        <div style="padding: 20px; height: 100%; overflow: auto; background-color: #f0f0f0;">
            <div class="peppablox-container">
                <div class="peppablox-header">
                    <h2>Peppablox</h2>
                    <p>Build your own worlds with Peppa Pig blocks!</p>
                </div>
                
                <div class="peppablox-grid">
                    <div class="peppablox-block" data-block-type="grass">
                        <img src="block_grass.png" alt="Grass Block">
                        <div>Grass</div>
                    </div>
                    <div class="peppablox-block" data-block-type="dirt">
                        <img src="block_dirt.png" alt="Dirt Block">
                        <div>Dirt</div>
                    </div>
                    <div class="peppablox-block" data-block-type="stone">
                        <img src="block_stone.png" alt="Stone Block">
                        <div>Stone</div>
                    </div>
                    <div class="peppablox-block" data-block-type="water">
                        <img src="block_water.png" alt="Water Block">
                        <div>Water</div>
                    </div>
                </div>
                
                <div class="peppablox-stage">
                    <div class="peppablox-world" style="width: 600px; height: 400px; border: 1px solid #ddd; display: flex; flex-wrap: wrap; overflow: auto;">
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Create content for the Terminal app
function createTerminalContent() {
    const terminalHTML = `
        <div style="height: 100%; background-color: #000; color: #0f0; font-family: monospace; padding: 10px; display: flex; flex-direction: column;">
            <div class="terminal-output" style="flex-grow: 1; overflow-y: auto; margin-bottom: 10px;">
                <div>Welcome to Pigmanal v1.0 *oink* *oink*</div>
                <div>Type 'help' to see available commands</div>
                <div>> </div>
            </div>
            <div style="display: flex;">
                <span style="margin-right: 5px;">></span>
                <input type="text" class="terminal-input" style="flex-grow: 1; background-color: #000; color: #0f0; border: none; outline: none; font-family: monospace;">
            </div>
        </div>
    `;
    
    // Add event listeners after content is added to DOM
    setTimeout(() => {
        const terminalInput = document.querySelector('.terminal-input');
        const terminalOutput = document.querySelector('.terminal-output');
        
        if (terminalInput && terminalOutput) {
            terminalInput.focus();
            
            terminalInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const command = this.value.trim().toLowerCase();
                    
                    // Add command to output
                    terminalOutput.innerHTML += `<div>> ${this.value}</div>`;
                    this.value = '';
                    
                    // Process command
                    if (command === 'help') {
                        terminalOutput.innerHTML += `<div>Available commands:</div>
                            <div>- help: Show this help message</div>
                            <div>- open app [app name]: Open an application</div>
                            <div>- wallpaper [image name]: Change desktop wallpaper</div>
                            <div>- joke: Tell a random joke</div>
                            <div>- clear: Clear the terminal</div>
                            <div>> </div>`;
                    } else if (command.startsWith('open app')) {
                        const appName = command.replace('open app', '').trim();
                        let foundApp = false;
                        
                        availableApps.forEach(app => {
                            if (app.name.toLowerCase().includes(appName) && app.installed) {
                                terminalOutput.innerHTML += `<div>Opening ${app.name}...</div><div>> </div>`;
                                openApp(app.id);
                                foundApp = true;
                            }
                        });
                        
                        if (!foundApp) {
                            terminalOutput.innerHTML += `<div>App '${appName}' not found or not installed.</div><div>> </div>`;
                        }
                    } else if (command.startsWith('wallpaper')) {
                        const wallpaper = command.replace('wallpaper', '').trim();
                        
                        if (wallpaper === 'default') {
                            document.querySelector('.desktop').style.backgroundImage = `url('wallpaper.png')`;
                            terminalOutput.innerHTML += `<div>Wallpaper set to default.</div><div>> </div>`;
                        } else if (['photo1', 'photo2', 'photo3', 'photo4'].includes(wallpaper)) {
                            document.querySelector('.desktop').style.backgroundImage = `url('${wallpaper}.png')`;
                            terminalOutput.innerHTML += `<div>Wallpaper set to ${wallpaper}.</div><div>> </div>`;
                            completeTask(2); // Complete task for changing wallpaper
                        } else {
                            terminalOutput.innerHTML += `<div>Invalid wallpaper. Try 'default', 'photo1', 'photo2', 'photo3', or 'photo4'.</div><div>> </div>`;
                        }
                    } else if (command === 'joke') {
                        const jokes = [
                            "Why did Peppa Pig go to the muddy puddle? To do the splish splash!",
                            "What's Peppa Pig's favorite game? Hide and Oink!",
                            "Why was George crying? Because he couldn't find his dinosaur!",
                            "What do you call a pig that does karate? Pork chop!",
                            "Why don't pigs use computers? They're afraid of the mouse!"
                        ];
                        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
                        terminalOutput.innerHTML += `<div>${randomJoke}</div><div>> </div>`;
                    } else if (command === 'clear') {
                        terminalOutput.innerHTML = '<div>> </div>';
                    } else if (command === 'delete os') {
                        terminalOutput.innerHTML += `<div>Warning: OS deletion initiated!</div><div>> </div>`;
                        startBlackHoleAnimation();
                    } else {
                        terminalOutput.innerHTML += `<div>Command not recognized. Type 'help' for available commands.</div><div>> </div>`;
                    }
                    
                    // Scroll to bottom
                    terminalOutput.scrollTop = terminalOutput.scrollHeight;
                }
            });
        }
    }, 100);
    
    return terminalHTML;
}

function setupPeppatubeEvents() {
    const peppatubeVideos = document.querySelectorAll('.peppatube-video');
    
    peppatubeVideos.forEach(video => {
        video.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            const videoTitle = this.getAttribute('data-title');
            const videoDesc = this.getAttribute('data-desc');
            
            playPeppatubeVideo(videoId, videoTitle, videoDesc);
        });
    });
}

function playPeppatubeVideo(videoId, title, description) {
    // Create player overlay
    const playerOverlay = document.createElement('div');
    playerOverlay.className = 'peppatube-player';
    
    playerOverlay.innerHTML = `
        <div class="peppatube-player-container">
            <div class="peppatube-player-video">
                <img src="video_thumb${videoId}.png" class="peppatube-player-frame" alt="Video frame">
                <div class="peppatube-player-close">✕</div>
            </div>
            <div class="peppatube-player-info">
                <div class="peppatube-player-title">${title}</div>
                <div class="peppatube-player-desc">${description}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(playerOverlay);
    
    // Add close button functionality
    const closeBtn = playerOverlay.querySelector('.peppatube-player-close');
    closeBtn.addEventListener('click', function() {
        clearInterval(frameInterval);
        document.body.removeChild(playerOverlay);
    });
    
    // Set up frame animation (5 frames cycling every second)
    const frameElement = playerOverlay.querySelector('.peppatube-player-frame');
    let currentFrame = 1;
    const frameCount = 5;
    
    // Create frame URLs - we'll just use slight variations of the same thumbnail
    const frames = [];
    for (let i = 1; i <= frameCount; i++) {
        frames.push(`video_thumb${videoId}.png`);
    }
    
    // Set up interval to change frames
    const frameInterval = setInterval(() => {
        // Apply a slight filter variation to simulate different frames
        const filters = [
            'brightness(1)',
            'brightness(1.1)',
            'brightness(0.9)',
            'brightness(1.05)',
            'brightness(0.95)'
        ];
        
        const currentFilter = filters[currentFrame - 1];
        frameElement.style.filter = currentFilter;
        currentFrame = currentFrame >= frameCount ? 1 : currentFrame + 1;
    }, 200); // 5 FPS
}

// Add event listeners after a window is created
function addAppSpecificListeners(appName) {
    if (appName === 'antivirus') {
        const scanBtn = document.querySelector('.antivirus-scan-btn');
        if (scanBtn) {
            scanBtn.addEventListener('click', function() {
                this.textContent = 'Scanning...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.textContent = 'Scan Complete!';
                    
                    // Show confirmation via Peppa assistant
                    const assistantBubble = document.querySelector('.assistant-bubble');
                    const assistantMessage = document.querySelector('.assistant-message');
                    assistantMessage.textContent = "No viruses found! Your computer is safe and clean! *snort*";
                    assistantBubble.style.display = 'block';
                    
                    // Hide after 3 seconds
                    setTimeout(() => {
                        assistantBubble.style.display = 'none';
                    }, 3000);
                    
                    // Reset button after 2 seconds
                    setTimeout(() => {
                        this.textContent = 'Run Full Scan';
                        this.disabled = false;
                    }, 2000);
                }, 3000);
            });
        }
    } else if (appName === 'trash') {
        const emptyBtn = document.querySelector('.empty-trash-btn');
        if (emptyBtn) {
            emptyBtn.addEventListener('click', function() {
                const trashItems = document.querySelector('.trash-items');
                if (trashItems) {
                    trashItems.innerHTML = '<div style="text-align: center; padding: 20px;">Trash is empty</div>';
                }
                
                // Show confirmation
                const assistantBubble = document.querySelector('.assistant-bubble');
                const assistantMessage = document.querySelector('.assistant-message');
                assistantMessage.textContent = "Trash emptied! Everything is clean now. *snort*";
                assistantBubble.style.display = 'block';
                
                // Hide after 3 seconds
                setTimeout(() => {
                    assistantBubble.style.display = 'none';
                }, 3000);
            });
        }
    } else if (appName === 'peppabox') {
        setupPeppaBoxEvents();
    } else if (appName === 'mnn') {
        // Add event listeners for Read More buttons
        document.querySelectorAll('.read-more-btn').forEach(button => {
            button.addEventListener('click', function() {
                const articleId = this.getAttribute('data-article');
                const articleFull = document.getElementById(`article-${articleId}`);
                
                if (articleFull.style.display === 'block') {
                    articleFull.style.display = 'none';
                    this.textContent = 'Read More';
                } else {
                    articleFull.style.display = 'block';
                    this.textContent = 'Show Less';
                }
            });
        });
    }
}

// Create content for file explorer
function createFileExplorerContent() {
    return `
        <div class="file-explorer-container">
            <div class="file-explorer-toolbar">
                <button style="padding: 5px 10px;">Back</button>
                <button style="padding: 5px 10px;">Forward</button>
                <span style="flex-grow: 1; padding: 5px 10px; background-color: white; border: 1px solid #ddd;">C:\\Peppa\\Documents</span>
            </div>
            <div class="file-explorer-content">
                <div class="file-explorer-sidebar">
                    <div style="font-weight: bold; margin-bottom: 10px;">Quick Access</div>
                    
                    <div class="file-item">
                        <img src="file_explorer_icon.png" alt="Documents">
                        Documents
                    </div>
                    <div class="file-item">
                        <img src="photos_icon.png" alt="Pictures">
                        Pictures
                    </div>
                    <div class="file-item">
                        <img src="music_icon.png" alt="Music">
                        Music
                    </div>
                    <div class="file-item">
                        <img src="peppatube_icon.png" alt="Videos">
                        Videos
                    </div>
                </div>
                <div class="file-explorer-main">
                    <div class="file-item">
                        <img src="notes_icon.png" alt="File">
                        My Notes.txt
                    </div>
                    <div class="file-item">
                        <img src="photos_icon.png" alt="File">
                        Muddy Puddle.png
                    </div>
                    <div class="file-item">
                        <img src="music_icon.png" alt="File">
                        Peppa Theme.mp3
                    </div>
                    <div class="file-item">
                        <img src="peppatube_icon.png" alt="File">
                        George's Birthday.mp4
                    </div>
                    <div class="file-item">
                        <img src="file_explorer_icon.png" alt="Folder">
                        Peppa's Projects
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Create content for trash
function createTrashContent() {
    return `
        <div class="trash-container">
            <h2>Trash</h2>
            <button class="empty-trash-btn">Empty Trash</button>
            
            <div class="trash-items">
                <div class="trash-item">
                    <img src="notes_icon.png" alt="Deleted File">
                    <div>Old Note.txt</div>
                </div>
                <div class="trash-item">
                    <img src="photos_icon.png" alt="Deleted File">
                    <div>Blurry Photo.png</div>
                </div>
                <div class="trash-item">
                    <img src="file_explorer_icon.png" alt="Deleted File">
                    <div>Unused Folder</div>
                </div>
            </div>
        </div>
    `;
}

// Create content for antivirus
function createAntivirusContent() {
    return `
        <div class="antivirus-container">
            <div class="antivirus-header">
                <h2>Peppa Shield Antivirus</h2>
                <p>Protecting your computer from nasty viruses! *snort*</p>
            </div>
            
            <div class="antivirus-status">
                <h3>System Status</h3>
                <div class="status-row">
                    <div>Real-time Protection:</div>
                    <div style="color: #4CAF50; font-weight: bold;">Active</div>
                </div>
                <div class="status-row">
                    <div>Last Scan:</div>
                    <div>Today at 9:15 AM</div>
                </div>
                <div class="status-row">
                    <div>Threats Detected:</div>
                    <div>0</div>
                </div>
                <div class="status-row">
                    <div>Virus Database:</div>
                    <div>Up to date</div>
                </div>
            </div>
            
            <button class="antivirus-scan-btn">Run Full Scan</button>
            
            <div class="antivirus-status">
                <h3>Protected Areas</h3>
                <div class="status-row">
                    <div>Files & Folders</div>
                    <div style="color: #4CAF50;">✓</div>
                </div>
                <div class="status-row">
                    <div>Web Browsing</div>
                    <div style="color: #4CAF50;">✓</div>
                </div>
                <div class="status-row">
                    <div>Email</div>
                    <div style="color: #4CAF50;">✓</div>
                </div>
                <div class="status-row">
                    <div>Suspicious Downloads</div>
                    <div style="color: #4CAF50;">✓</div>
                </div>
            </div>
        </div>
    `;
}

function createPeppaBoxContent() {
    return `
        <div class="peppabox-container">
            <div class="peppabox-header">
                <h2>PeppaBox</h2>
                <p>Create your own Peppa music mix!</p>
            </div>
            
            <div class="peppabox-controls">
                <button id="peppabox-play" class="peppabox-button">▶ Play</button>
                <button id="peppabox-stop" class="peppabox-button">⏹ Stop</button>
                <button id="peppabox-clear" class="peppabox-button">🗑️ Clear</button>
            </div>
            
            <div class="peppabox-stage">
                <div class="peppabox-characters-container"></div>
                <div class="peppabox-timeline"></div>
            </div>
            
            <div class="peppabox-characters">
                <div class="peppabox-character-item" data-sound="beat">
                    <img src="peppa_avatar.png" class="peppabox-character-img" alt="Peppa">
                    <div>Beat</div>
                </div>
                <div class="peppabox-character-item" data-sound="melody">
                    <img src="george_pig.png" class="peppabox-character-img" alt="George">
                    <div>Melody</div>
                </div>
                <div class="peppabox-character-item" data-sound="snort">
                    <img src="peppa_avatar.png" class="peppabox-character-img peppabox-daddy" alt="Daddy Pig">
                    <div>Snort</div>
                </div>
                <div class="peppabox-character-item" data-sound="oink">
                    <img src="george_pig.png" class="peppabox-character-img peppabox-mummy" alt="Mummy Pig">
                    <div>Oink</div>
                </div>
            </div>
            
            <div class="peppabox-message">Drag characters to the stage to create music!</div>
        </div>
    `;
}

function addAppSpecificListeners(appName) {
    if (appName === 'antivirus') {
        const scanBtn = document.querySelector('.antivirus-scan-btn');
        if (scanBtn) {
            scanBtn.addEventListener('click', function() {
                this.textContent = 'Scanning...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.textContent = 'Scan Complete!';
                    
                    // Show confirmation via Peppa assistant
                    const assistantBubble = document.querySelector('.assistant-bubble');
                    const assistantMessage = document.querySelector('.assistant-message');
                    assistantMessage.textContent = "No viruses found! Your computer is safe and clean! *snort*";
                    assistantBubble.style.display = 'block';
                    
                    // Hide after 3 seconds
                    setTimeout(() => {
                        assistantBubble.style.display = 'none';
                    }, 3000);
                    
                    // Reset button after 2 seconds
                    setTimeout(() => {
                        this.textContent = 'Run Full Scan';
                        this.disabled = false;
                    }, 2000);
                }, 3000);
            });
        }
    } else if (appName === 'trash') {
        const emptyBtn = document.querySelector('.empty-trash-btn');
        if (emptyBtn) {
            emptyBtn.addEventListener('click', function() {
                const trashItems = document.querySelector('.trash-items');
                if (trashItems) {
                    trashItems.innerHTML = '<div style="text-align: center; padding: 20px;">Trash is empty</div>';
                }
                
                // Show confirmation
                const assistantBubble = document.querySelector('.assistant-bubble');
                const assistantMessage = document.querySelector('.assistant-message');
                assistantMessage.textContent = "Trash emptied! Everything is clean now. *snort*";
                assistantBubble.style.display = 'block';
                
                // Hide after 3 seconds
                setTimeout(() => {
                    assistantBubble.style.display = 'none';
                }, 3000);
            });
        }
    } else if (appName === 'peppabox') {
        setupPeppaBoxEvents();
    } else if (appName === 'mnn') {
        // Add event listeners for Read More buttons
        document.querySelectorAll('.read-more-btn').forEach(button => {
            button.addEventListener('click', function() {
                const articleId = this.getAttribute('data-article');
                const articleFull = document.getElementById(`article-${articleId}`);
                
                if (articleFull.style.display === 'block') {
                    articleFull.style.display = 'none';
                    this.textContent = 'Read More';
                } else {
                    articleFull.style.display = 'block';
                    this.textContent = 'Show Less';
                }
            });
        });
    }
}

function setupPeppaBoxEvents() {
    const playBtn = document.getElementById('peppabox-play');
    const stopBtn = document.getElementById('peppabox-stop');
    const clearBtn = document.getElementById('peppabox-clear');
    const charactersContainer = document.querySelector('.peppabox-characters-container');
    const characterItems = document.querySelectorAll('.peppabox-character-item');
    
    let isPlaying = false;
    let activeCharacters = [];
    let audioElements = [];
    
    // Initialize timeline
    const timeline = document.querySelector('.peppabox-timeline');
    if (timeline) {
        timeline.innerHTML = '<div class="peppabox-beat"></div>'.repeat(8);
    }
    
    // Make character items draggable
    characterItems.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('sound', this.getAttribute('data-sound'));
        });
        
        item.setAttribute('draggable', 'true');
    });
    
    // Setup drop area
    if (charactersContainer) {
        charactersContainer.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        
        charactersContainer.addEventListener('drop', function(e) {
            e.preventDefault();
            const sound = e.dataTransfer.getData('sound');
            
            // Create character in the container
            const character = document.createElement('div');
            character.className = 'peppabox-active-character';
            character.setAttribute('data-sound', sound);
            
            // Add image based on sound type
            let imgSrc, characterClass = '';
            switch(sound) {
                case 'beat':
                    imgSrc = 'peppa_avatar.png';
                    break;
                case 'melody':
                    imgSrc = 'george_pig.png';
                    break;
                case 'snort':
                    imgSrc = 'peppa_avatar.png';
                    characterClass = 'peppabox-daddy';
                    break;
                case 'oink':
                    imgSrc = 'george_pig.png';
                    characterClass = 'peppabox-mummy';
                    break;
            }
            
            character.innerHTML = `<img src="${imgSrc}" class="peppabox-character-img ${characterClass}">`;
            
            // Position at drop coordinates
            const rect = charactersContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            character.style.left = x + 'px';
            character.style.top = y + 'px';
            
            // Add close button
            const closeBtn = document.createElement('div');
            closeBtn.className = 'peppabox-remove';
            closeBtn.textContent = '×';
            closeBtn.addEventListener('click', function() {
                character.remove();
                // Remove from active characters
                const index = activeCharacters.findIndex(c => c.element === character);
                if (index !== -1) {
                    activeCharacters.splice(index, 1);
                }
            });
            
            character.appendChild(closeBtn);
            charactersContainer.appendChild(character);
            
            // Add to active characters
            activeCharacters.push({
                element: character,
                sound: sound
            });
            
            // If already playing, start this sound
            if (isPlaying) {
                playCharacterSound(sound);
            }
        });
    }
    
    // Play button
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            if (!isPlaying) {
                startPlayback();
                this.textContent = '⏸ Pause';
                isPlaying = true;
            } else {
                pausePlayback();
                this.textContent = '▶ Play';
                isPlaying = false;
            }
        });
    }
    
    // Stop button
    if (stopBtn) {
        stopBtn.addEventListener('click', function() {
            stopPlayback();
            if (playBtn) {
                playBtn.textContent = '▶ Play';
                isPlaying = false;
            }
        });
    }
    
    // Clear button
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            clearStage();
        });
    }
    
    function startPlayback() {
        // Start the beat visualization
        if (timeline) {
            let currentBeat = 0;
            const beats = timeline.querySelectorAll('.peppabox-beat');
            
            window.peppaboxInterval = setInterval(() => {
                // Reset previous beat
                beats.forEach(beat => beat.classList.remove('active'));
                
                // Activate current beat
                beats[currentBeat].classList.add('active');
                
                // Play sounds based on active characters
                if (currentBeat === 0) {
                    activeCharacters.forEach(character => {
                        playCharacterSound(character.sound);
                    });
                }
                
                // Increment beat
                currentBeat = (currentBeat + 1) % beats.length;
            }, 500); // 120 BPM
        }
    }
    
    function pausePlayback() {
        clearInterval(window.peppaboxInterval);
        // Stop all audio
        audioElements.forEach(audio => {
            audio.pause();
        });
    }
    
    function stopPlayback() {
        clearInterval(window.peppaboxInterval);
        
        // Reset beat visualization
        if (timeline) {
            const beats = timeline.querySelectorAll('.peppabox-beat');
            beats.forEach(beat => beat.classList.remove('active'));
        }
        
        // Stop all audio
        audioElements.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    }
    
    function clearStage() {
        // Stop playback
        stopPlayback();
        
        // Reset play button
        if (playBtn) {
            playBtn.textContent = '▶ Play';
            isPlaying = false;
        }
        
        // Clear characters
        if (charactersContainer) {
            charactersContainer.innerHTML = '';
        }
        
        // Reset active characters
        activeCharacters = [];
    }
    
    function playCharacterSound(sound) {
        // Create or reuse audio element
        let audio = audioElements.find(a => a.dataset.sound === sound && !a.playing);
        
        if (!audio) {
            audio = document.createElement('audio');
            audio.dataset.sound = sound;
            document.body.appendChild(audio);
            audioElements.push(audio);
        }
        
        // Set source based on sound type
        switch(sound) {
            case 'beat':
                audio.src = 'peppa-pig-intro.mp3'; // Using the existing audio
                break;
            case 'melody':
                audio.src = 'peppa-pig-intro.mp3'; // Using the existing audio
                audio.currentTime = 5; // Start at a different point
                break;
            case 'snort':
                audio.src = 'peppa-pig-intro.mp3'; // Using the existing audio
                audio.currentTime = 10; // Start at a different point
                break;
            case 'oink':
                audio.src = 'peppa-pig-intro.mp3'; // Using the existing audio
                audio.currentTime = 15; // Start at a different point
                break;
        }
        
        // Play the sound
        audio.volume = 0.5;
        audio.loop = false;
        audio.playing = true;
        
        audio.play().catch(error => console.log("Audio play failed:", error));
        
        // Reset playing status when done
        audio.onended = function() {
            audio.playing = false;
        };
    }
}

function createPigpointContent() {
    return `
        <div style="padding: 20px; height: 100%; overflow: auto; background-color: #fff;">
            <div style="margin-bottom: 20px; display: flex; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
                <button style="margin-right: 10px; padding: 5px 10px; background-color: #f5a9c7; border: none; color: white; border-radius: 3px;">New Slide</button>
                <button style="margin-right: 10px; padding: 5px 10px; background-color: #f5a9c7; border: none; color: white; border-radius: 3px;">Insert Image</button>
                <button style="margin-right: 10px; padding: 5px 10px; background-color: #f5a9c7; border: none; color: white; border-radius: 3px;">Themes</button>
                <button style="margin-right: 10px; padding: 5px 10px; background-color: #f5a9c7; border: none; color: white; border-radius: 3px;">Present</button>
            </div>
            
            <div style="display: flex; height: calc(100% - 60px);">
                <div style="width: 200px; background-color: #f9f9f9; padding: 10px; border-right: 1px solid #ddd;">
                    <div style="font-weight: bold; margin-bottom: 10px;">Slide 1</div>
                    <div style="font-weight: bold; margin-bottom: 10px;">Slide 2</div>
                    <div style="font-weight: bold; margin-bottom: 10px; background-color: #f5a9c7; color: white;">Slide 3</div>
                </div>
                <div style="flex-grow: 1; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #e0e0e0;">
                    <div style="width: 80%; height: 80%; background-color: white; box-shadow: 0 5px 15px rgba(0,0,0,0.1); display: flex; flex-direction: column; padding: 20px;">
                        <h1 style="font-size: 24px; text-align: center; margin-bottom: 20px; color: #f5a9c7;">My Peppa Pig Presentation</h1>
                        <ul style="font-size: 18px; margin-left: 30px;">
                            <li>I love jumping in muddy puddles</li>
                            <li>George loves his dinosaur</li>
                            <li>Daddy Pig is very good at reading maps</li>
                            <li>Mummy Pig is very clever</li>
                        </ul>
                        <div style="margin-top: auto; text-align: right; font-size: 12px; color: #777;">Slide 3 of 3</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createWordpigContent() {
    return `
        <div style="padding: 20px; height: 100%; overflow: auto; background-color: #fff; display: flex; flex-direction: column;">
            <div style="margin-bottom: 20px; display: flex; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
                <button style="margin-right: 10px; padding: 5px 10px; background-color: #f5a9c7; border: none; color: white; border-radius: 3px;">File</button>
                <button style="margin-right: 10px; padding: 5px 10px; background-color: #f5a9c7; border: none; color: white; border-radius: 3px;">Edit</button>
                <button style="margin-right: 10px; padding: 5px 10px; background-color: #f5a9c7; border: none; color: white; border-radius: 3px;">View</button>
                <button style="margin-right: 10px; padding: 5px 10px; background-color: #f5a9c7; border: none; color: white; border-radius: 3px;">Insert</button>
                <button style="margin-right: 10px; padding: 5px 10px; background-color: #f5a9c7; border: none; color: white; border-radius: 3px;">Format</button>
            </div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                <select style="padding: 3px; border: 1px solid #ddd;">
                    <option>Peppa Sans</option>
                    <option>Pig Times</option>
                    <option>Oink Comic</option>
                </select>
                <select style="padding: 3px; border: 1px solid #ddd;">
                    <option>12</option>
                    <option selected>14</option>
                    <option>16</option>
                    <option>18</option>
                </select>
                <button style="padding: 3px 8px; background-color: white; border: 1px solid #ddd;">B</button>
                <button style="padding: 3px 8px; background-color: white; border: 1px solid #ddd;">I</button>
                <button style="padding: 3px 8px; background-color: white; border: 1px solid #ddd;">U</button>
            </div>
            
            <div style="flex-grow: 1; border: 1px solid #ddd; padding: 20px; overflow: auto;">
                <h1 style="color: #f5a9c7;">My Day with Peppa Pig</h1>
                <p>Today I went to Peppa Pig's house. We had a lovely time jumping in muddy puddles. *splash* *splash*</p>
                <p>George was there too, playing with his dinosaur. Dinosaur! *snort* *snort*</p>
                <p>Daddy Pig made us some pancakes. They were delicious!</p>
                <p>Mummy Pig told us a bedtime story before I went home.</p>
                <p>It was the best day ever!</p>
            </div>
            
            <div style="margin-top: 10px; display: flex; justify-content: space-between; color: #777; font-size: 12px;">
                <div>Document1.pigdoc</div>
                <div>Words: 56</div>
            </div>
        </div>
    `;
}

function createPeppacelContent() {
    return `
        <div style="padding: 20px; height: 100%; overflow: auto; background-color: #fff; display: flex; flex-direction: column;">
            <div style="margin-bottom: 20px; display: flex; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
                <button style="margin-right: 10px; padding: 5px 10px; background-color: #f5a9c7; border: none; color: white; border-radius: 3px;">File</button>
                <button style="margin-right: 10px; padding: 5px 10px; background-color: #f5a9c7; border: none; color: white; border-radius: 3px;">Home</button>
                <button style="margin-right: 10px; padding: 5px 10px; background-color: #f5a9c7; border: none; color: white; border-radius: 3px;">Insert</button>
                <button style="margin-right: 10px; padding: 5px 10px; background-color: #f5a9c7; border: none; color: white; border-radius: 3px;">Formulas</button>
                <button style="margin-right: 10px; padding: 5px 10px; background-color: #f5a9c7; border: none; color: white; border-radius: 3px;">Data</button>
            </div>
            
            <div style="flex-grow: 1; overflow: auto; border: 1px solid #ddd;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="background-color: #f5a9c7; color: white;">
                        <td style="width: 30px; text-align: center; border: 1px solid #ddd;"></td>
                        <td style="width: 100px; text-align: center; font-weight: bold; border: 1px solid #ddd;">A</td>
                        <td style="width: 100px; text-align: center; font-weight: bold; border: 1px solid #ddd;">B</td>
                        <td style="width: 100px; text-align: center; font-weight: bold; border: 1px solid #ddd;">C</td>
                        <td style="width: 100px; text-align: center; font-weight: bold; border: 1px solid #ddd;">D</td>
                    </tr>
                    <tr>
                        <td style="text-align: center; font-weight: bold; background-color: #f5a9c7; color: white; border: 1px solid #ddd;">1</td>
                        <td style="border: 1px solid #ddd; padding: 5px;">Item</td>
                        <td style="border: 1px solid #ddd; padding: 5px;">Quantity</td>
                        <td style="border: 1px solid #ddd; padding: 5px;">Price</td>
                        <td style="border: 1px solid #ddd; padding: 5px;">Total</td>
                    </tr>
                    <tr>
                        <td style="text-align: center; font-weight: bold; background-color: #f5a9c7; color: white; border: 1px solid #ddd;">2</td>
                        <td style="border: 1px solid #ddd; padding: 5px;">Muddy Puddles</td>
                        <td style="border: 1px solid #ddd; padding: 5px;">5</td>
                        <td style="border: 1px solid #ddd; padding: 5px;">₱2</td>
                        <td style="border: 1px solid #ddd; padding: 5px;">₱10</td>
                    </tr>
                    <tr>
                        <td style="text-align: center; font-weight: bold; background-color: #f5a9c7; color: white; border: 1px solid #ddd;">3</td>
                        <td style="border: 1px solid #ddd; padding: 5px;">Dinosaurs</td>
                        <td style="border: 1px solid #ddd; padding: 5px;">1</td>
                        <td style="border: 1px solid #ddd; padding: 5px;">₱15</td>
                        <td style="border: 1px solid #ddd; padding: 5px;">₱15</td>
                    </tr>
                    <tr>
                        <td style="text-align: center; font-weight: bold; background-color: #f5a9c7; color: white; border: 1px solid #ddd;">4</td>
                        <td style="border: 1px solid #ddd; padding: 5px;">Peppa Snacks</td>
                        <td style="border: 1px solid #ddd; padding: 5px;">3</td>
                        <td style="border: 1px solid #ddd; padding: 5px;">₱5</td>
                        <td style="border: 1px solid #ddd; padding: 5px;">₱15</td>
                    </tr>
                    <tr>
                        <td style="text-align: center; font-weight: bold; background-color: #f5a9c7; color: white; border: 1px solid #ddd;">5</td>
                        <td style="border: 1px solid #ddd; padding: 5px;"></td>
                        <td style="border: 1px solid #ddd; padding: 5px;"></td>
                        <td style="border: 1px solid #ddd; padding: 5px; font-weight: bold;">Total:</td>
                        <td style="border: 1px solid #ddd; padding: 5px; font-weight: bold;">₱40</td>
                    </tr>
                </table>
            </div>
            
            <div style="margin-top: 10px; display: flex; justify-content: space-between; color: #777; font-size: 12px;">
                <div>Peppa_Budget.pigcel</div>
                <div>Sheet 1 of 1</div>
            </div>
        </div>
    `;
}

function createGeorgeAnimateContent() {
    return `
        <div style="padding: 20px; height: 100%; overflow: auto; background-color: #333; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #4dabf5;">GeorgeAnimate Studio</h2>
                <div>
                    <button style="background-color: #4dabf5; color: white; border: none; padding: 5px 15px; border-radius: 3px; margin-right: 10px;">Save</button>
                    <button style="background-color: #4dabf5; color: white; border: none; padding: 5px 15px; border-radius: 3px;">Export</button>
                </div>
            </div>
            
            <div style="display: flex; height: calc(100% - 60px); gap: 20px;">
                <div style="width: 200px; background-color: #222; padding: 10px; border-radius: 5px;">
                    <h3 style="margin-top: 0; color: #4dabf5;">Characters</h3>
                    <div style="margin-bottom: 10px;">
                        <div style="background-color: #444; padding: 10px; border-radius: 5px; display: flex; align-items: center;">
                            <img src="george_pig.png" style="width: 40px; height: 40px; margin-right: 10px;">
                            <div>George</div>
                        </div>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <div style="background-color: #444; padding: 10px; border-radius: 5px; display: flex; align-items: center;">
                            <img src="peppa_avatar.png" style="width: 40px; height: 40px; margin-right: 10px;">
                            <div>Peppa</div>
                        </div>
                    </div>
                    <button style="background-color: #4dabf5; color: white; border: none; padding: 5px 15px; border-radius: 3px; width: 100%; margin-top: 10px;">Add Character</button>
                </div>
                
                <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 20px;">
                    <div style="flex-grow: 1; background-color: #222; border-radius: 5px; display: flex; justify-content: center; align-items: center; position: relative;">
                        <div style="position: absolute; top: 10px; left: 10px; color: #777;">Preview Stage</div>
                        <img src="george_pig.png" style="width: 200px; height: auto;">
                    </div>
                    
                    <div style="height: 120px; background-color: #222; border-radius: 5px; padding: 10px; position: relative;">
                        <div style="position: absolute; top: 10px; left: 10px; color: #777;">Timeline</div>
                        <div style="display: flex; height: 70%; margin-top: 30px;">
                            <div style="width: 100px; background-color: #4dabf5; margin-right: 2px; border-radius: 3px;"></div>
                            <div style="width: 150px; background-color: #f5a9c7; margin-right: 2px; border-radius: 3px;"></div>
                            <div style="width: 80px; background-color: #4dabf5; margin-right: 2px; border-radius: 3px;"></div>
                        </div>
                    </div>
                </div>
                
                <div style="width: 250px; background-color: #222; padding: 10px; border-radius: 5px;">
                    <h3 style="margin-top: 0; color: #4dabf5;">Properties</h3>
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 5px;">Position X</label>
                        <input type="range" style="width: 100%;">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 5px;">Position Y</label>
                        <input type="range" style="width: 100%;">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 5px;">Scale</label>
                        <input type="range" style="width: 100%;">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 5px;">Rotation</label>
                        <input type="range" style="width: 100%;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px;">Actions</label>
                        <select style="width: 100%; padding: 5px; background-color: #333; color: white; border: 1px solid #555;">
                            <option>Jump</option>
                            <option>Walk</option>
                            <option>Dinosaur Play</option>
                            <option>Snort</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createDaddyBasicsContent() {
    return `
        <div style="height: 100%; background-color: #f5a9c7; display: flex; flex-direction: column; position: relative; overflow: hidden;">
            <div style="height: 60px; background-color: #333; display: flex; justify-content: space-between; align-items: center; padding: 0 20px;">
                <div style="color: white; font-size: 24px; font-weight: bold;">Daddy's Pig Basics</div>
                <div style="color: white;">
                    <span style="margin-right: 20px;">Problems: 0/7</span>
                    <span>Time: 00:00</span>
                </div>
            </div>
            
            <div style="flex-grow: 1; background-image: url('wallpaper.png'); background-size: cover; display: flex; justify-content: center; align-items: center; position: relative;">
                <div style="position: absolute; top: 20px; left: 20px; background-color: white; padding: 15px; border-radius: 10px; max-width: 300px;">
                    <div style="font-weight: bold; margin-bottom: 10px; font-size: 18px;">Welcome to School!</div>
                    <div>Find all 7 problems and solve them correctly!</div>
                    <div style="margin-top: 10px;">Press SPACE to start...</div>
                </div>
                
                <img src="daddy_basics_icon.png" style="position: absolute; bottom: 20px; right: 20px; width: 200px; height: auto; animation: float 2s infinite alternate ease-in-out;">
            </div>
            
            <style>
                @keyframes float {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-10px); }
                }
            </style>
        </div>
    `;
}

function showDaddyBasicsWarning() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '10000';
    
    // Create warning box
    const warningBox = document.createElement('div');
    warningBox.style.width = '400px';
    warningBox.style.backgroundColor = '#f5a9c7';
    warningBox.style.borderRadius = '10px';
    warningBox.style.padding = '20px';
    warningBox.style.textAlign = 'center';
    warningBox.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
    
    warningBox.innerHTML = `
        <h2 style="margin-bottom: 15px;">WARNING!</h2>
        <img src="daddy_basics_icon.png" style="width: 100px; margin-bottom: 15px;">
        <p style="margin-bottom: 20px;">This education game may be scary for little piggies! Daddy Pig will test your math skills. Are you sure you want to continue?</p>
        <div style="display: flex; justify-content: space-around;">
            <button id="basics-cancel" style="padding: 10px 20px; background-color: #ddd; border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
            <button id="basics-continue" style="padding: 10px 20px; background-color: #ff4444; color: white; border: none; border-radius: 5px; cursor: pointer;">Continue</button>
        </div>
    `;
    
    modal.appendChild(warningBox);
    document.body.appendChild(modal);
    
    // Add event listeners
    document.getElementById('basics-cancel').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    document.getElementById('basics-continue').addEventListener('click', function() {
        document.body.removeChild(modal);
        createDaddyBasicsWindow();
    });
}

function createDaddyBasicsWindow() {
    const title = "Daddy's Pig Basics";
    const content = createDaddyBasicsContent();
    createWindow('daddybasics', title, content);
}

function setupDaddyBasicsEvents() {
    // Listen for spacebar press to start the game
    const daddyBasicsWindow = document.querySelector('.window-content');
    if (daddyBasicsWindow) {
        daddyBasicsWindow.addEventListener('keydown', function(e) {
            if (e.code === 'Space') {
                // Change the welcome message to first problem
                const welcomeDiv = this.querySelector('.window-content > div > div:first-child');
                if (welcomeDiv) {
                    welcomeDiv.innerHTML = `
                        <div style="font-weight: bold; margin-bottom: 10px; font-size: 18px;">Problem 1:</div>
                        <div>What is 2 + 2?</div>
                        <div style="margin-top: 10px;">Type your answer...</div>
                    `;
                    
                    // Start the timer
                    const timeSpan = this.querySelector('.window-content span:last-child');
                    if (timeSpan) {
                        let seconds = 0;
                        window.daddyBasicsTimer = setInterval(() => {
                            seconds++;
                            const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
                            const secs = (seconds % 60).toString().padStart(2, '0');
                            timeSpan.textContent = `Time: ${mins}:${secs}`;
                        }, 1000);
                    }
                }
            }
        });
        
        // Set focus to the window to capture keydown events
        daddyBasicsWindow.setAttribute('tabindex', '0');
        setTimeout(() => daddyBasicsWindow.focus(), 200);
    }
}

// PeppaCraft download effect
function startPeppacraftDownloadEffect() {
    // Create overlay for download progress
    const overlay = document.createElement('div');
    overlay.className = 'peppacraft-overlay';
    
    overlay.innerHTML = `
        <div class="download-progress">
            <div>Downloading PeppaCraft...</div>
            <div style="margin: 15px 0;">
                <div style="width: 100%; height: 20px; background-color: #ddd; border-radius: 10px; overflow: hidden;">
                    <div id="download-bar" style="width: 0%; height: 100%; background-color: #f5a9c7;"></div>
                </div>
            </div>
            <div id="download-percent">0%</div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Animate progress bar
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 5;
        if (progress > 100) progress = 100;
        
        const progressBar = document.getElementById('download-bar');
        const progressText = document.getElementById('download-percent');
        
        if (progressBar && progressText) {
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${Math.floor(progress)}%`;
            
            if (progress === 100) {
                clearInterval(interval);
                
                // Show "Installing" message
                const downloadProgress = document.querySelector('.download-progress');
                if (downloadProgress) {
                    downloadProgress.innerHTML = `
                        <div>Installing PeppaCraft...</div>
                        <div style="margin: 15px 0;">
                            <img src="peppa_bootup_logo.png" class="spinning" style="width: 50px; height: 50px;">
                        </div>
                    `;
                }
                
                // After "installation", open Pigcraft app
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    openApp('pigcraft');
                }, 3000);
            }
        }
    }, 100);
}

function createMNNContent() {
    return `
        <div class="mnn-container">
            <div class="mnn-header">
                <h1>Muddy News Network</h1>
                <p>Your trusted source for all Peppa Pig world news!</p>
            </div>
            
            <div class="mnn-articles">
                <div class="mnn-article">
                    <div class="article-header">
                        <h2>Peppa Pig OS Set to Replace MrSun OS</h2>
                        <span class="article-date">Today, 9:15 AM</span>
                    </div>
                    <div class="article-preview">
                        <img src="wallpaper.png" alt="Peppa Pig OS" class="article-image">
                        <p>In a surprising tech development, Peppa Pig OS is planning to replace the popular MrSun OS. Industry experts are calling this bootleg operating system "revolutionary" for its muddy puddle interface.</p>
                        <button class="read-more-btn" data-article="1">Read More</button>
                    </div>
                    <div class="article-full" id="article-1">
                        <p>The transition is expected to happen over the next few months, with Peppa Pig OS offering features that MrSun OS users have been requesting for years.</p>
                        <p>"We're excited to bring the joy of muddy puddles to computing," said Peppa Pig, CEO of Peppa Technologies. "Our OS is designed to be user-friendly, even for the youngest piglets."</p>
                        <p>MrSun OS has been declining in popularity since its controversial update that removed all mud-based animations. Peppa Pig OS, with its emphasis on pink interfaces and oink-based notifications, has been gaining a steady following.</p>
                        <p>The company has promised that all MrSun OS users will get a free upgrade to Peppa Pig OS, complete with a virtual muddy puddle screensaver.</p>
                    </div>
                </div>
                
                <div class="mnn-article">
                    <div class="article-header">
                        <h2>Peppa's Family Welcomes New Baby Sister Evie</h2>
                        <span class="article-date">Yesterday, 3:30 PM</span>
                    </div>
                    <div class="article-preview">
                        <img src="peppa_avatar.png" alt="Peppa Family" class="article-image">
                        <p>The Pig family has joyfully announced the arrival of baby Evie Pig, the newest and youngest member of the family. Meanwhile, sources close to the family report that George is "planning his villain arc."</p>
                        <button class="read-more-btn" data-article="2">Read More</button>
                    </div>
                    <div class="article-full" id="article-2">
                        <p>Baby Evie has already shown a fondness for muddy puddles, just like her older sister Peppa. Mummy Pig and Daddy Pig are delighted with their new addition to the family.</p>
                        <p>"We're all very excited to have Evie join our family," said Mummy Pig. "George is being a wonderful big brother, although he has been spending a lot of time in his room making plans that he won't show anyone."</p>
                        <p>Friends of the family have expressed concern over George's recent behavior, which has included wearing a makeshift cape, practicing evil laughs, and referring to his dinosaur toy as his "minion."</p>
                        <p>"It's just a phase," assured Daddy Pig. "Every little piggy goes through their villain arc. I remember when I tried to take over the puddle-jumping championship with my weather-controlling device."</p>
                    </div>
                </div>
                
                <div class="mnn-article">
                    <div class="article-header">
                        <h2>Peppa Pig Assistant Receives Major Update</h2>
                        <span class="article-date">2 days ago, 11:45 AM</span>
                    </div>
                    <div class="article-preview">
                        <img src="peppa_assistant.png" alt="Peppa Assistant" class="article-image">
                        <p>The popular Peppa Pig Assistant has received a significant update, introducing new features and improvements to help users navigate their digital lives with more oinks and snorts than ever before.</p>
                        <button class="read-more-btn" data-article="3">Read More</button>
                    </div>
                    <div class="article-full" id="article-3">
                        <p>The update includes enhanced muddy puddle detection capabilities, allowing the assistant to notify users when it's the perfect weather for puddle jumping in their area.</p>
                        <p>"We've completely revamped the assistant's AI," explained the lead developer. "It now understands over 50 different types of oinks and can translate them into actionable commands."</p>
                        <p>Other new features include a dinosaur locator for helping users find missing toys, a bedtime story generator with Daddy Pig's voice, and integration with smart home devices to automate tasks like turning on muddy puddle sprinklers.</p>
                        <p>Users have reported high satisfaction with the update, with many praising the new "Snort to Search" feature that allows hands-free operation.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}