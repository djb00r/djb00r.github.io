// --- Global State ---
let activeWindowZIndex = 10;
let conversationHistory = []; // For Clippy AI
let currentFilePath = ['C:']; // For File Explorer
let isWindowsME = false; // New flag for Windows ME mode
let currentWallpaper = '/wallpaper.jpg'; // Track current wallpaper
let appStates = {}; // Track state of apps like Notepad, Paint

// --- Web Audio API for Music ---
let audioContext;
let marioPaintMusicBuffer;
let marioPaintMusicSource;

async function loadAudio(url) {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
}

async function playMarioPaintMusic() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume context if it was suspended (e.g., due to user interaction policies)
    if (audioContext.state === 'suspended') {
        await audioContext.resume();
    }

    if (!marioPaintMusicBuffer) {
        try {
            marioPaintMusicBuffer = await loadAudio('/Creative Exercise   Mario Paint Music Extended.mp3');
        } catch (e) {
            console.error("Error loading Mario Paint music:", e);
            return;
        }
    }

    if (marioPaintMusicSource) {
        marioPaintMusicSource.stop();
        marioPaintMusicSource.disconnect();
    }

    marioPaintMusicSource = audioContext.createBufferSource();
    marioPaintMusicSource.buffer = marioPaintMusicBuffer;
    marioPaintMusicSource.loop = true;
    marioPaintMusicSource.connect(audioContext.destination);
    marioPaintMusicSource.start(0);
}

function stopMarioPaintMusic() {
    if (marioPaintMusicSource) {
        marioPaintMusicSource.stop();
        marioPaintMusicSource.disconnect();
        marioPaintMusicSource = null;
    }
}


const fileSystem = {
    'C:': {
        type: 'folder',
        contents: {
            'Users': { type: 'folder', contents: { 'User': { type: 'folder', contents: {} } } },
            'Program Files': { type: 'folder', contents: { 'Microsoft': { type: 'folder', contents: {} } } },
            'Windows': {
                type: 'folder',
                contents: {
                    'System32': { type: 'folder', contents: { 'ntoskrnl.exe': { type: 'file' }, 'hal.dll': { type: 'file' }, 'drivers': { type: 'folder', contents: {} } } },
                    'Fonts': { type: 'folder', contents: {} },
                    'SystemApps': { type: 'folder', contents: {} }
                }
            },
            'Saved Items': {
                type: 'folder',
                contents: {
                    'Welcome.txt': { type: 'file', fileType: 'text', content: 'Welcome to your new Notepad! You can save your text files here.' },
                }
            }
        }
    }
};

const desktopIcons = Array.from(document.querySelectorAll('.desktop-icon')); // Global reference to desktop icons
const taskbarIcons = document.querySelector('.taskbar-icons');

// --- Utility Functions ---
function createElement(tag, className, id = '', innerHTML = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (id) element.id = id;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

function getZIndex(element) {
    const style = window.getComputedStyle(element);
    return parseInt(style.zIndex, 10) || 0;
}

function bringToFront(windowElement) {
    activeWindowZIndex++;
    windowElement.style.zIndex = activeWindowZIndex;
}

// Function to create a generic system dialog/error message
function createSystemDialog(id, title, message, iconUrl = null, buttons = [{ text: 'OK', callback: null }], dialogType = 'info') {
    // Remove existing dialog of the same ID if it exists
    const existingDialog = document.getElementById(id);
    if (existingDialog) existingDialog.remove();

    const dialog = createElement('div', `system-dialog ${dialogType}-dialog`, id);
    dialog.style.zIndex = activeWindowZIndex + 100; // Always on top

    const titleBar = createElement('div', 'dialog-title-bar');
    titleBar.innerHTML = `<span>${title}</span>`;
    const closeBtn = createElement('div', 'dialog-close-button', '', '✕');
    closeBtn.addEventListener('click', () => dialog.remove());
    titleBar.appendChild(closeBtn);
    dialog.appendChild(titleBar);

    const contentArea = createElement('div', 'dialog-content');
    if (iconUrl) {
        const icon = createElement('img', 'dialog-icon');
        icon.src = iconUrl;
        contentArea.appendChild(icon);
    }
    const messagePara = createElement('p', '', '', message);
    contentArea.appendChild(messagePara);
    dialog.appendChild(contentArea);

    const buttonContainer = createElement('div', 'dialog-buttons');
    buttons.forEach(btn => {
        const button = createElement('button', `dialog-button ${btn.class || ''}`, '', btn.text);
        button.addEventListener('click', () => {
            if (btn.callback) btn.callback();
            dialog.remove();
        });
        buttonContainer.appendChild(button);
    });
    dialog.appendChild(buttonContainer);

    document.body.appendChild(dialog); // Append to body to overlay everything

    // Play sound for error or warning dialogs
    if (dialogType === 'error' || dialogType === 'warning') {
        const errorAudio = new Audio('/error_sound.mp3');
        errorAudio.volume = 0.8;
        errorAudio.play().catch(e => console.error("Error playing sound:", e));
    }

    return dialog;
}

// --- Window Management ---
const windowContainer = document.getElementById('window-container');

function createWindow(id, title, contentHtml, options = {}) {
    const existingWindow = document.getElementById(id);
    if (existingWindow) {
        bringToFront(existingWindow);
        existingWindow.classList.remove('minimized');
        existingWindow.style.display = ''; // Show if minimized
        return; // Already open, just bring to front
    }

    const windowElement = createElement('div', 'window', id);
    windowElement.style.top = `${options.top || 100}px`;
    windowElement.style.left = `${options.left || 100}px`;
    windowElement.style.width = `${options.width || 600}px`;
    windowElement.style.height = `${options.height || 400}px`;
    bringToFront(windowElement);

    const titleBar = createElement('div', 'window-title-bar');
    titleBar.innerHTML = `<span class="window-title">${title}</span>`;
    windowElement.appendChild(titleBar);

    const buttons = createElement('div', 'window-buttons');
    const minimizeBtn = createElement('div', 'window-button minimize-button', '', '—');
    const maximizeBtn = createElement('div', 'window-button maximize-button', '', '⬜');
    const closeBtn = createElement('div', 'window-button close', '', '✕');

    buttons.appendChild(minimizeBtn);
    buttons.appendChild(maximizeBtn);
    buttons.appendChild(closeBtn);
    titleBar.appendChild(buttons);

    const content = createElement('div', 'window-content');
    content.innerHTML = contentHtml;
    windowElement.appendChild(content);
    windowContainer.appendChild(windowElement);

    // Taskbar App Icon
    const appIcon = createElement('button', 'taskbar-app-icon');
    appIcon.dataset.windowId = id;
    appIcon.innerHTML = `<img src="${options.icon || '/control.png'}" alt="${title}" style="width:24px;height:24px;">`;
    taskbarIcons.appendChild(appIcon);

    appIcon.addEventListener('click', () => {
        if (windowElement.classList.contains('minimized') || windowElement.style.display === 'none') {
            windowElement.classList.remove('minimized');
            windowElement.style.display = '';
            bringToFront(windowElement);
        } else {
            windowElement.classList.add('minimized');
            windowElement.style.display = 'none';
        }
    });

    // Window control buttons
    minimizeBtn.addEventListener('click', () => {
        windowElement.classList.add('minimized');
        windowElement.style.display = 'none'; // Hide fully
    });

    maximizeBtn.addEventListener('click', () => {
        windowElement.classList.toggle('maximized');
        // If maximized, disable resizing
        if (windowElement.classList.contains('maximized')) {
            windowElement.style.resize = 'none';
            titleBar.style.cursor = 'default';
        } else {
            windowElement.style.resize = 'both';
            titleBar.style.cursor = 'grab';
        }
    });

    closeBtn.addEventListener('click', (e) => {
        if (appStates[id]?.isDirty) {
            e.stopPropagation(); // Prevent immediate close
            createSystemDialog(
                `save-confirm-${id}`,
                'Unsaved Changes',
                `Do you want to save changes to ${appStates[id].filename || 'Untitled'}?`,
                '/warning.png',
                [
                    { text: 'Save', callback: () => { appStates[id].saveFunction(); closeWindow(); } },
                    { text: "Don't Save", class: 'secondary', callback: () => closeWindow() },
                    { text: 'Cancel', class: 'secondary', callback: () => {} }
                ],
                'warning'
            );
        } else {
            closeWindow();
        }
    });

    function closeWindow() {
        if (id === 'clippy-app') {
            conversationHistory = []; // Reset Clippy conversation
        }
        if (id === 'ms-paint-app') {
            stopMarioPaintMusic(); // Stop music when Paint app closes
        }
        delete appStates[id]; // Clean up app state
        windowElement.remove();
        appIcon.remove();
    }

    // Bring to front on click anywhere on the window
    windowElement.addEventListener('mousedown', (e) => {
        // Only bring to front if not clicking on a control button within the window
        if (!e.target.closest('.window-button') && !e.target.closest('.system-dialog')) {
            bringToFront(windowElement);
        }
    });

    // Make window draggable
    let isDragging = false;
    let offsetX, offsetY;

    titleBar.addEventListener('mousedown', (e) => {
        if (windowElement.classList.contains('maximized') || windowElement.style.cursor === 'default') return; // Do not drag if maximized or cursor is default
        isDragging = true;
        offsetX = e.clientX - windowElement.getBoundingClientRect().left;
        offsetY = e.clientY - windowElement.getBoundingClientRect().top;
        titleBar.style.cursor = 'grabbing';
        bringToFront(windowElement);
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        // Keep window within desktop boundaries
        const desktop = document.getElementById('desktop');
        const desktopRect = desktop.getBoundingClientRect();
        const windowRect = windowElement.getBoundingClientRect();

        newX = Math.max(desktopRect.left, Math.min(newX, desktopRect.right - windowRect.width));
        newY = Math.max(desktopRect.top, Math.min(newY, desktopRect.bottom - windowRect.height));

        windowElement.style.left = `${newX}px`;
        windowElement.style.top = `${newY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        if (!windowElement.classList.contains('maximized')) {
            titleBar.style.cursor = 'grab';
        }
    });

    return windowElement;
}

// --- Taskbar Clock ---
function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');

    timeElement.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    dateElement.textContent = now.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' });
}
setInterval(updateTime, 1000);
updateTime(); // Initial call

// --- Start Menu Logic ---
const startButton = document.getElementById('start-button');
const startMenu = document.getElementById('start-menu');
const startMenuSearch = document.getElementById('start-menu-search');
const startMenuTiles = document.getElementById('start-menu-tiles');
const startMenuAllApps = document.getElementById('start-menu-all-apps');

const apps = [
    { id: 'edge-app', name: 'Microsoft Edge', icon: '/Microsoft_Edge_logo_(2019).png', type: 'app', action: () => launchEdgeBrowser() },
    { id: 'store-app', name: 'Microsoft Store', icon: '/Microsoft_Store_Fluent_Design_icon_(2).png', type: 'app', action: () => launchMicrosoftStore() },
    { id: 'clippy-app', name: 'AI Clippy', icon: '/Clippy.png', type: 'app', action: () => launchClippyApp() },
    { id: 'recycle-bin-app', name: 'Recycle Bin', icon: '/bin-windows.png', type: 'app', action: () => launchRecycleBin() },
    { id: 'file-explorer-app', name: 'File Explorer', icon: '/file-explorer-folder-libraries-icon-18298.png', type: 'app', action: () => launchFileExplorer() }, // Placeholder icon
    { id: 'photos-app', name: 'Photos', icon: '/photos-icon.png', type: 'app', action: () => launchPhotosApp() },
    { id: 'calculator-app', name: 'Calculator', icon: '/calculator-icon.png', type: 'app', action: () => launchCalculatorApp() },
    { id: 'settings-app', name: 'Settings', icon: '/settings-icon.png', type: 'app', action: () => launchSettingsApp() },
    { id: 'duolingo-app', name: 'Duolingo', icon: '/duolingo-icon.png', type: 'app', action: () => launchDuolingoApp() },
    { id: 'winver-app', name: 'Winver', icon: '/winver_icon.png', type: 'app', action: () => launchWinverApp() },
    { id: 'youtube-app', name: 'YouTube', icon: '/youtube_icon.png', type: 'app', action: () => launchYoutubeApp() },
    { id: 'virtualbox-app', name: 'VirtualBox', icon: '/virtualbox_icon.png', type: 'app', action: () => launchVirtualBoxApp() },
    { id: 'control-panel-app', name: 'Control Panel', icon: '/control.png', type: 'app', action: () => launchControlPanelApp() },
    { id: 'minesweeper-app', name: 'Minesweeper', icon: '/Minesweeper_2005.webp', type: 'app', action: () => launchMinesweeperApp() },
    { id: 'ms-paint-app', name: 'MS Paint', icon: '/Paint.png', type: 'app', action: () => launchMSPaintApp() }, // New: MS Paint app
    { id: 'notepad-app', name: 'Notepad', icon: '/forbidden.png', type: 'app', action: () => launchNotepadApp() },
];

const tileApps = [
    { id: 'edge-app', name: 'Edge', icon: '/Microsoft_Edge_logo_(2019).png', wide: false },
    { id: 'store-app', name: 'Store', icon: '/Microsoft_Store_Fluent_Design_icon_(2).png', wide: false },
    { id: 'clippy-app', name: 'Clippy', icon: '/Clippy.png', wide: true }, // Make Clippy tile wide
    { id: 'photos-app', name: 'Photos', icon: '/photos-icon.png', wide: false },
    { id: 'calculator-app', name: 'Calculator', icon: '/calculator-icon.png', wide: false },
    { id: 'duolingo-app', name: 'Duolingo', icon: '/duolingo-icon.png', wide: false },
    { id: 'youtube-app', name: 'YouTube', icon: '/youtube_icon.png', wide: false }, // New YouTube tile
    { id: 'virtualbox-app', name: 'VirtualBox', icon: '/virtualbox_icon.png', wide: false },
    { id: 'control-panel-app', name: 'Control Panel', icon: '/control.png', wide: false },
    { id: 'minesweeper-app', name: 'Minesweeper', icon: '/Minesweeper_2005.webp', wide: false },
    { id: 'ms-paint-app', name: 'MS Paint', icon: '/Paint.png', wide: false }, // New: MS Paint tile
    { id: 'notepad-app', name: 'Notepad', icon: '/forbidden.png', wide: false },
];


function renderStartMenu() {
    // Render Tiles
    startMenuTiles.innerHTML = '';
    tileApps.forEach(appInfo => {
        const tile = createElement('div', `start-menu-tile ${appInfo.wide ? 'wide' : ''}`);
        tile.id = `tile-${appInfo.id}`;
        tile.innerHTML = `<img src="${appInfo.icon}" alt="${appInfo.name}"><br><span>${appInfo.name}</span>`;
        tile.addEventListener('click', () => {
            const app = apps.find(a => a.id === appInfo.id);
            if (app && app.action) app.action();
            toggleStartMenu(false); // Close start menu after launching app
        });
        startMenuTiles.appendChild(tile);
    });

    // Render All Apps list
    startMenuAllApps.innerHTML = '<h3>All apps</h3>';
    apps.sort((a, b) => a.name.localeCompare(b.name)).forEach(app => {
        const appItem = createElement('div', 'start-menu-app-item', '', app.name);
        appItem.addEventListener('click', () => {
            if (app.action) app.action();
            toggleStartMenu(false); // Close start menu
        });
        startMenuAllApps.appendChild(appItem);
    });
}

function filterStartMenuApps(query) {
    const lowerQuery = query.toLowerCase();

    // Filter Tiles (simple hide/show based on name)
    Array.from(startMenuTiles.children).forEach(tile => {
        const appName = tile.querySelector('span').textContent.toLowerCase();
        tile.style.display = appName.includes(lowerQuery) ? '' : 'none';
    });

    // Filter All Apps list
    Array.from(startMenuAllApps.children).forEach(appItem => {
        if (appItem.tagName === 'H3') return; // Skip the header
        const appName = appItem.textContent.toLowerCase();
        appItem.style.display = appName.includes(lowerQuery) ? '' : 'none';
    });
}


function toggleStartMenu(forceState = null) {
    const isShowing = startMenu.classList.contains('show');
    const newState = forceState !== null ? forceState : !isShowing;

    if (newState) {
        startMenu.classList.remove('hidden');
        // Trigger reflow to ensure transition plays from initial state
        void startMenu.offsetWidth;
        startMenu.classList.add('show');
        renderStartMenu(); // Re-render content on show
        startMenuSearch.focus(); // Focus search on open
    } else {
        startMenu.classList.remove('show');
        startMenu.addEventListener('transitionend', function handler() {
            startMenu.classList.add('hidden');
            startMenu.removeEventListener('transitionend', handler);
        });
    }
}

startButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent document click from closing it immediately
    toggleStartMenu();
});

document.addEventListener('click', (e) => {
    if (!startMenu.contains(e.target) && !startButton.contains(e.target) && startMenu.classList.contains('show')) {
        toggleStartMenu(false); // Close if clicked outside
    }
});

startMenuSearch.addEventListener('input', (e) => {
    filterStartMenuApps(e.target.value);
});


// --- App Launchers ---

// Generic Browser/Store Placeholder
function launchGenericApp(id, title, url) {
    const content = `
        <div style="padding: 20px; text-align: center;">
            <h2>Welcome to ${title}!</h2>
            <p>This is a placeholder for a real application.</p>
            <p>You can imagine browsing the web or downloading apps here.</p>
            ${url ? `<p><a href="${url}" target="_blank" style="color: #0078d4;">Go to ${title} Website</a></p>` : ''}
        </div>
    `;
    createWindow(id, title, content, { width: 800, height: 600, top: 50, left: 150 });
}

function launchMicrosoftStore() {
    launchGenericApp('microsoft-store', 'Microsoft Store', 'https://www.microsoft.com/store');
}

function launchFileExplorer() {
    const content = `
        <div class="file-explorer-toolbar">
            <button id="fe-back-button"><img src="https://img.icons8.com/ios-filled/20/ffffff/back.png" alt="Back" style="filter: invert(1);"> Back</button>
            <button id="fe-up-button"><img src="https://img.icons8.com/ios-filled/20/ffffff/up.png" alt="Up" style="filter: invert(1);"> Up</button>
            <input type="text" id="fe-path-input" class="path-input" value="C:\\" readonly>
            <button id="fe-delete-button" style="color: #f00;">
                <img src="/error-cancel-abort-icon.png" alt="Delete" style="width: 20px; height: 20px; vertical-align: middle; filter: invert(0.8);">
                Delete
            </button>
        </div>
        <div class="file-explorer-body">
            <div class="sidebar">
                <h3 style="margin-top: 0; color: #ccc;">Quick access</h3>
                <div class="sidebar-item" data-path="C:">
                    <img src="/file-explorer-folder-libraries-icon-18298.png" alt="This PC">
                    <span>This PC</span>
                </div>
                <div class="sidebar-item" data-path="C:\\Users">
                    <img src="/user_profile.png" alt="Users">
                    <span>Users</span>
                </div>
                <div class="sidebar-item" data-path="C:\\Windows">
                    <img src="/warning.png" alt="Windows">
                    <span>Windows</span>
                </div>
                <!-- Add more sidebar items here if desired -->
            </div>
            <div class="main-content-area" id="fe-content-area">
                <!-- File/Folder items will be rendered here -->
            </div>
        </div>
    `;
    const feWindow = createWindow('file-explorer', 'File Explorer', content, { width: 900, height: 650, top: 80, left: 200 });

    const pathInput = feWindow.querySelector('#fe-path-input');
    const contentArea = feWindow.querySelector('#fe-content-area');
    const backButton = feWindow.querySelector('#fe-back-button');
    const upButton = feWindow.querySelector('#fe-up-button');
    const deleteButton = feWindow.querySelector('#fe-delete-button');

    // Initial path
    currentFilePath = ['C:'];
    renderFolderContent();

    backButton.addEventListener('click', () => {
        if (currentFilePath.length > 1) {
            currentFilePath.pop();
            renderFolderContent();
        }
    });

    upButton.addEventListener('click', () => {
        if (currentFilePath.length > 1) {
            currentFilePath.pop();
            renderFolderContent();
        }
    });

    deleteButton.addEventListener('click', () => {
        if (selectedItemForDeletion) {
            deleteFileOrFolder(selectedItemForDeletion);
            selectedItemForDeletion = null; // Clear selection
        } else {
            createSystemDialog('fe-select-error', 'File Explorer', "Please select a file or folder to delete.", '/error-cancel-abort-icon.png', undefined, 'error');
        }
    });

    // Handle sidebar clicks
    feWindow.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', () => {
            const newPath = item.dataset.path.split('\\');
            // Ensure C: is handled correctly as the root.
            currentFilePath = newPath[0] === 'C:' ? ['C:'].concat(newPath.slice(1)) : newPath;
            renderFolderContent();
        });
    });

    let selectedItemForDeletion = null;

    function renderFolderContent() {
        contentArea.innerHTML = '';
        const currentFolderData = getFolderData(currentFilePath);
        pathInput.value = currentFilePath.join('\\');

        if (!currentFolderData || currentFolderData.type !== 'folder') {
            contentArea.innerHTML = '<div style="color: #aaa; padding: 20px;">Folder not found or is not a folder.</div>';
            return;
        }

        for (const name in currentFolderData.contents) {
            const item = currentFolderData.contents[name];
            const itemElement = createElement('div', item.type === 'folder' ? 'folder-item' : 'file-item');
            itemElement.dataset.name = name; // Store name for deletion
            itemElement.innerHTML = `
                <img src="${item.type === 'folder' ? '/file-explorer-folder-libraries-icon-18298.png' : 'https://img.icons8.com/ios-glyphs/48/ffffff/file--v1.png'}" alt="${name}">
                <span>${name}</span>
            `;

            itemElement.addEventListener('click', (e) => {
                // Select item for deletion
                if (selectedItemForDeletion) {
                    selectedItemForDeletion.style.backgroundColor = '';
                    selectedItemForDeletion.style.border = '1px solid transparent';
                }
                selectedItemForDeletion = itemElement;
                itemElement.style.backgroundColor = 'rgba(0, 120, 215, 0.4)';
                itemElement.style.border = '1px solid #0078d4';
                e.stopPropagation(); // Prevent deselecting by clicking background

                if (item.type === 'folder') {
                    // Double click to navigate
                    if (itemElement.dataset.lastClick && (Date.now() - itemElement.dataset.lastClick < 300)) {
                        currentFilePath.push(name);
                        renderFolderContent();
                        selectedItemForDeletion = null; // Clear selection on navigation
                    }
                    itemElement.dataset.lastClick = Date.now();
                } else {
                    // Open file (simple alert)
                    if (itemElement.dataset.lastClick && (Date.now() - itemElement.dataset.lastClick < 300)) {
                         createSystemDialog('file-open-sim', 'File Viewer', `Opening ${name}... (This is a simulated file)`, null);
                         selectedItemForDeletion = null; // Clear selection on open
                    }
                    itemElement.dataset.lastClick = Date.now();
                }
            });
            contentArea.appendChild(itemElement);
        }

        // Click outside items to deselect
        contentArea.addEventListener('click', () => {
            if (selectedItemForDeletion) {
                selectedItemForDeletion.style.backgroundColor = '';
                selectedItemForDeletion.style.border = '1px solid transparent';
                selectedItemForDeletion = null;
            }
        });
    }

    function getFolderData(pathArray) {
        let currentLevel = fileSystem;
        for (let i = 0; i < pathArray.length; i++) {
            const segment = pathArray[i];
            if (currentLevel[segment] && currentLevel[segment].type === 'folder') {
                currentLevel = currentLevel[segment].contents;
            } else {
                return null; // Path segment not found or not a folder
            }
        }
        return { type: 'folder', contents: currentLevel };
    }

    function deleteFileOrFolder(elementToDelete) {
        const itemName = elementToDelete.dataset.name;
        let parentFolderData = getFolderData(currentFilePath);

        if (parentFolderData && parentFolderData.contents[itemName]) {
            if (itemName === 'System32' && currentFilePath.includes('Windows')) {
                triggerSystem32Deletion();
            } else {
                // Simulate deletion for other files/folders
                delete parentFolderData.contents[itemName];
                elementToDelete.remove();
                createSystemDialog('file-deleted', 'File Explorer', `'${itemName}' deleted.`, null, [{text: 'OK'}]);
            }
        } else {
            createSystemDialog('delete-error', 'File Explorer', "Item not found for deletion.", '/error-cancel-abort-icon.png', undefined, 'error');
        }
    }
}

function launchPhotosApp() {
    const content = `
        <div style="padding: 20px; text-align: center;">
            <h2>Welcome to Photos!</h2>
            <p>This is where your memories live.</p>
            <p>Imagine browsing your pictures here.</p>
        </div>
    `;
    createWindow('photos-app', 'Photos', content, { width: 800, height: 600, top: 100, left: 200 });
}

function launchCalculatorApp() {
    const content = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20px;">
            <input type="text" value="0" style="width: 90%; margin-bottom: 15px; padding: 10px; font-size: 2em; text-align: right; background-color: #333; color: white; border: 1px solid #555; border-radius: 5px;" readonly>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; width: 90%;">
                ${['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map(btn => `<button style="padding: 15px; font-size: 1.5em; background-color: #555; color: white; border: none; border-radius: 5px; cursor: pointer;">${btn}</button>`).join('')}
            </div>
            <p style="margin-top: 20px; font-size: 0.9em; color: #aaa;">A simple calculator placeholder.</p>
        </div>
    `;
    createWindow('calculator-app', 'Calculator', content, { width: 350, height: 500, top: 250, left: 500 });
}

function launchSettingsApp() {
    const content = `
        <div style="display: flex; height: 100%;">
            <div style="width: 180px; padding: 15px; border-right: 1px solid #4a4a4a; flex-shrink: 0;">
                <h3 style="margin-top: 0;">Settings</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="padding: 8px 0; cursor: pointer; color: #eee;">System</li>
                    <li style="padding: 8px 0; cursor: pointer; color: #eee;">Devices</li>
                    <li style="padding: 8px 0; cursor: pointer; color: #eee;">Phone</li>
                    <li style="padding: 8px 0; cursor: pointer; color: #eee;">Network & Internet</li>
                    <li style="padding: 8px 0; cursor: pointer; color: #eee;">Personalization</li>
                </ul>
            </div>
            <div style="flex-grow: 1; padding: 20px;">
                <h2>Welcome to Settings!</h2>
                <p>This is where you can customize your Windows experience.</p>
                <p>Imagine adjusting display, sounds, or privacy here.</p>
            </div>
        </div>
    `;
    createWindow('settings-app', 'Settings', content, { width: 700, height: 550, top: 120, left: 220 });
}

function launchDuolingoApp() {
    const content = `
        <div style="padding: 20px; text-align: center;">
            <img src="/duolingo-icon.png" alt="Duolingo Icon" style="width: 80px; height: 80px; margin-bottom: 20px;">
            <h2>Welcome to Duolingo!</h2>
            <p>Learn a new language, for free. Forever.</p>
            <p>Imagine practicing your Spanish or French lessons here!</p>
            <p><a href="https://www.duolingo.com/" target="_blank" style="color: #1cb0f6;">Go to Duolingo.com</a></p>
        </div>
    `;
    createWindow('duolingo-app', 'Duolingo', content, { width: 500, height: 400, top: 200, left: 350 });
}

function launchEdgeBrowser() {
    const content = `
        <div class="address-bar">
            <button class="nav-button">⮜</button>
            <button class="nav-button">⮞</button>
            <button class="nav-button">↻</button>
            <input type="text" value="bing.com" class="address-input" id="edge-address-input">
        </div>
        <div class="browser-main-content" id="edge-browser-main-content">
            <!-- Content dynamically loaded here -->
        </div>
    `;
    const edgeWindow = createWindow('edge-browser', 'Microsoft Edge', content, { width: 1000, height: 700, top: 50, left: 150 });

    const addressInput = edgeWindow.querySelector('#edge-address-input');
    const browserMainContent = edgeWindow.querySelector('#edge-browser-main-content');

    function loadBingHomePage() {
        addressInput.value = 'bing.com';
        browserMainContent.innerHTML = `
            <div class="bing-home">
                <div class="bing-logo">Bing</div>
                <div class="bing-search-container">
                    <input type="text" class="bing-search-input" id="bing-search-input" placeholder="Search the web...">
                    <button class="bing-search-button" id="bing-search-button">Search</button>
                </div>
                <div class="search-results" id="bing-search-results">
                    <!-- Search results will appear here -->
                </div>
                <div class="ad-container">
                    <div class="ad-item" id="ad-eatables">
                        <img src="/ad.png" alt="Ad: Eatables">
                        <span>Click for amazing deals!</span>
                    </div>
                    <div class="ad-item" id="ad-badweek">
                        <img src="/badweek.png" alt="Ad: Bad Week">
                        <span>Feeling down? Click here!</span>
                    </div>
                    <div class="ad-item" id="ad-windows-me-downgrade">
                        <img src="/maxresdefault.jpg" alt="Ad: Windows ME">
                        <span>Experience the Millennium! (Windows ME)</span>
                    </div>
                </div>
            </div>
        `;
        const searchInput = browserMainContent.querySelector('#bing-search-input');
        const searchButton = browserMainContent.querySelector('#bing-search-button');
        const searchResultsDiv = browserMainContent.querySelector('#bing-search-results');

        // Attach click listeners for ads after they are loaded into the DOM
        edgeWindow.querySelector('#ad-eatables').addEventListener('click', () => navigateToVirusDownloadPage(edgeWindow));
        edgeWindow.querySelector('#ad-badweek').addEventListener('click', () => navigateToBadWeekAdPage(edgeWindow));
        edgeWindow.querySelector('#ad-windows-me-downgrade').addEventListener('click', () => navigateToMEDowngradePage(edgeWindow));

        function performBingSearch() {
            const query = searchInput.value.trim();
            if (!query) {
                searchResultsDiv.innerHTML = '';
                return;
            }

            searchResultsDiv.innerHTML = ''; // Clear previous results

            if (query.toLowerCase() === 'windows me downgrade') {
                const resultItem = createElement('div', 'search-result-item');
                resultItem.innerHTML = `
                    <a href="#" class="downgrade-link" data-url="websim://windows-me-downgrade-page">Windows ME Downgrade - Get Legacy OS</a>
                    <div class="url">https://www.oldwindows.com/me-download</div>
                    <div class="description">Are you brave enough to downgrade your modern PC to the infamous Windows ME? Click here for a nostalgic (and painful) experience!</div>
                `;
                searchResultsDiv.appendChild(resultItem);
                resultItem.querySelector('.downgrade-link').addEventListener('click', (e) => {
                    e.preventDefault();
                    navigateToMEDowngradePage(edgeWindow);
                });
            } else {
                for (let i = 1; i <= 10; i++) {
                    const resultItem = createElement('div', 'search-result-item');
                    const title = `Result ${i}: ${query} - Example Title ${i}`;
                    const url = `https://www.example.com/${query.replace(/\s+/g, '-')}-${i}`;
                    const description = `This is a simulated search result for "${query}". Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;
                    resultItem.innerHTML = `
                        <a href="#" onclick="alert('Navigating to: ${url}'); return false;">${title}</a>
                        <div class="url">${url}</div>
                        <div class="description">${description}</div>
                    `;
                    searchResultsDiv.appendChild(resultItem);
                }
            }
        }

        searchButton.addEventListener('click', performBingSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performBingSearch();
            }
        });
    }

    function handleEdgeNavigation(url) {
        if (url === 'websim://windows-me-downgrade-page') {
            navigateToMEDowngradePage(edgeWindow);
        } else if (url === 'websim://amazing-deals-virus') {
            navigateToVirusDownloadPage(edgeWindow);
        } else if (url === 'websim://bad-week-help') {
            navigateToBadWeekAdPage(edgeWindow);
        }
        else if (url === 'bing.com') {
            loadBingHomePage();
        } else {
            // Generic page not found
            browserMainContent.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #ccc;">
                    <h2>Cannot display this page</h2>
                    <p>The requested URL <strong>${url}</strong> could not be found.</p>
                    <p>Try checking the address for typos or searching Bing.</p>
                </div>
            `;
        }
        addressInput.value = url;
    }

    addressInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleEdgeNavigation(addressInput.value.trim().toLowerCase());
        }
    });

    // Initial load
    loadBingHomePage();
}

function navigateToMEDowngradePage(edgeWindow) {
    const browserMainContent = edgeWindow.querySelector('#edge-browser-main-content');
    const addressInput = edgeWindow.querySelector('#edge-address-input');

    addressInput.value = 'websim://windows-me-downgrade-page';
    browserMainContent.innerHTML = `
        <div style="padding: 40px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
            <h1 style="color: #fff; margin-bottom: 20px;">Download Windows Millennium Edition</h1>
            <p style="color: #ccc; margin-bottom: 30px; font-size: 1.1em;">Are you sure you want to experience the true essence of the millennium bug?</p>
            <button id="download-me-button" style="background-color: #0078d4; color: white; border: none; padding: 15px 30px; font-size: 1.2em; cursor: pointer; border-radius: 5px; transition: background-color 0.2s;">
                Download Windows ME (Warning: May break system!)
            </button>
            <p style="color: #aaa; margin-top: 20px; font-size: 0.9em;">Clicking this button will simulate a system downgrade.</p>
        </div>
    `;

    edgeWindow.querySelector('#download-me-button').addEventListener('click', () => {
        edgeWindow.remove(); // Close Edge window
        initiateMEDowngrade();
    });
}

function navigateToVirusDownloadPage(edgeWindow) {
    const browserMainContent = edgeWindow.querySelector('#edge-browser-main-content');
    const addressInput = edgeWindow.querySelector('#edge-address-input');

    addressInput.value = 'websim://amazing-deals-virus';
    browserMainContent.innerHTML = `
        <div style="padding: 40px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
            <h1 style="color: #fff; margin-bottom: 20px;">🎉 Amazing Deals for YOU! 🎉</h1>
            <p style="color: #ccc; margin-bottom: 30px; font-size: 1.1em;">Click below to unlock incredible discounts and free software!</p>
            <button id="download-virus-button" style="background-color: #4CAF50; color: white; border: none; padding: 15px 30px; font-size: 1.2em; cursor: pointer; border-radius: 5px; transition: background-color 0.2s;">
                Download "Free Software" Now!
            </button>
            <p style="color: #aaa; margin-top: 20px; font-size: 0.9em;">(Warning: May contain unexpected features...)</p>
        </div>
    `;
    edgeWindow.querySelector('#download-virus-button').addEventListener('click', () => {
        edgeWindow.remove(); // Close Edge
        initiateVirusAttack();
    });
}

function navigateToBadWeekAdPage(edgeWindow) {
    const browserMainContent = edgeWindow.querySelector('#edge-browser-main-content');
    const addressInput = edgeWindow.querySelector('#edge-address-input');

    addressInput.value = 'websim://bad-week-help';
    browserMainContent.innerHTML = `
        <div style="padding: 40px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
            <img src="/badweek.png" alt="Bad Week Cat" style="max-width: 250px; margin-bottom: 20px;">
            <h1 style="color: #fff; margin-bottom: 20px;">Having a Bad Week?</h1>
            <p style="color: #ccc; margin-bottom: 30px; font-size: 1.1em;">We understand! Sometimes things just don't go your way.</p>
            <p style="color: #aaa; font-size: 0.9em;">(This is a simulated support page. No actual help offered.)</p>
            <button style="background-color: #0078d4; color: white; border: none; padding: 10px 20px; font-size: 1em; cursor: pointer; border-radius: 5px; margin-top: 20px;">
                Get Simulated Support
            </button>
        </div>
    `;
    // Make the button do something simple, like an alert
    edgeWindow.querySelector('button').addEventListener('click', () => {
        createSystemDialog('bad-week-sim-support', 'Support', 'Simulated support session initiated. Please wait while we do nothing.', null, undefined, 'error');
    });
}

// --- AI Clippy App ---
async function launchClippyApp() {
    const content = `
        <div id="clippy-image-container">
            <img src="/Clippy.png" alt="Clippy">
        </div>
        <div id="clippy-speech-bubble">
            Hello there! Ask me to open an app, or click "Custom Error" for fun.
        </div>
        <div id="clippy-input-container">
            <input type="text" id="clippy-input" placeholder="Ask Clippy something...">
            <button id="clippy-ask-button">Ask</button>
            <button id="clippy-speak-button">🔊</button>
            <button id="clippy-error-button">Custom Error</button>
        </div>
    `;
    const clippyWindow = createWindow('clippy-app', 'AI Clippy', content, { width: 420, height: 380, top: 180, left: 400 });

    const clippyInput = clippyWindow.querySelector('#clippy-input');
    const clippyAskButton = clippyWindow.querySelector('#clippy-ask-button');
    const clippyErrorButton = clippyWindow.querySelector('#clippy-error-button');
    const clippySpeechBubble = clippyWindow.querySelector('#clippy-speech-bubble');


    async function askClippy() {
        const question = clippyInput.value.trim();
        if (!question) return;

        clippyInput.value = '';
        clippySpeechBubble.textContent = 'Thinking...';
        clippyAskButton.disabled = true;
        clippyInput.disabled = true;

        try {
            const appMap = {
                edge: launchEdgeBrowser,
                store: launchMicrosoftStore,
                clippy: () => {},
                explorer: launchFileExplorer,
                photos: launchPhotosApp,
                calculator: launchCalculatorApp,
                settings: launchSettingsApp,
                duolingo: launchDuolingoApp,
                winver: launchWinverApp,
                youtube: launchYoutubeApp,
                virtualbox: launchVirtualBoxApp,
                control: launchControlPanelApp,
                minesweeper: launchMinesweeperApp,
                recycle: launchRecycleBin,
                error: launchErrorGeneratorApp,
                paint: launchMSPaintApp
            };
            const lower = question.toLowerCase();
            for (const [key, fn] of Object.entries(appMap)) {
                if (lower.includes(key)) { fn(); clippySpeechBubble.textContent = `Opening ${key}...`; clippyAskButton.disabled = false; clippyInput.disabled = false; return; }
            }

            const newMsg = { role: "user", content: question };
            conversationHistory.push(newMsg);
            conversationHistory = conversationHistory.slice(-10);

            const completion = await websim.chat.completions.create({
                messages: [
                    { role: "system", content: "You are Clippy. You can open apps like Edge, Store, Explorer, Photos, Calculator, Settings, Duolingo, Winver, YouTube, VirtualBox, Control Panel, Minesweeper, Recycle Bin, Error Generator, Paint. Use keywords like 'open edge'." },
                    ...conversationHistory
                ]
            });
            const response = completion.content;
            conversationHistory.push(completion);
            clippySpeechBubble.textContent = response;
        } catch (error) {
            console.error("Clippy AI error:", error);
            clippySpeechBubble.textContent = "Oops! Something went wrong. Try again!";
        } finally {
            clippyAskButton.disabled = false;
            clippyInput.disabled = false;
        }
    }

    clippyErrorButton.addEventListener('click', () => {
        const customError = prompt("Enter a custom error message:", "Something went wrong!");
        if (customError) createSystemDialog('clippy-custom', 'Custom Error', customError, '/error-cancel-abort-icon.png', undefined, 'error');
    });

    clippyAskButton.addEventListener('click', askClippy);
    clippyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            askClippy();
        }
    });
}


// --- Recycle Bin / MEMZ Logic ---
function launchRecycleBin() {
    const content = `
        <div style="font-size: 1.1em; margin-bottom: 15px; color: #eee;">Items in Recycle Bin:</div>
        <div id="memz-item" class="recycle-bin-item">
            <img src="/memz.webp" alt="MEMZ">
            <span>MEMZ.exe</span>
        </div>
        <div style="font-size: 0.9em; color: #aaa; margin-top: 20px;">
            To restore an item, drag it out. To delete permanently, empty the recycle bin.
        </div>
    `;
    const recycleBinWindow = createWindow('recycle-bin-window', 'Recycle Bin', content, { width: 400, height: 300, top: 150, left: 250 });

    recycleBinWindow.querySelector('#memz-item').addEventListener('click', launchMemzSimulation);
}

async function launchMemzSimulation() {
    // Play MEMZ sound
    const memzAudio = new Audio('/memz_sound.mp3');
    memzAudio.volume = 0.7;
    memzAudio.play();

    const content = `
        <img src="/memz.webp" alt="MEMZ Robot" style="margin-bottom: 20px;">
        <div class="memz-warning-text">
            WARNING: MEMZ.exe has been detected!
            <br>
            Your system is compromised. Do NOT attempt to close this window.
            <br>
            Attempting to terminate MEMZ.exe may result in irreversible system damage.
            <br><br>
            Please contact support immediately.
        </div>
        <button id="memz-abort-button" style="margin-top: 30px;">
            <img src="/error-cancel-abort-icon.png" alt="Abort" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px; filter: invert(1);">
            ABORT SYSTEM
        </button>
    `;

    const memzWindow = createWindow('memz-window', 'System Alert - MEMZ Initiated', content, { width: 600, height: 450, top: 200, left: 300 });

    memzWindow.querySelector('#memz-abort-button').addEventListener('click', () => {
        memzWindow.remove();
        memzAudio.pause(); // Stop the sound when closing
        memzAudio.currentTime = 0;
        createSystemDialog('memz-terminated', 'System Alert', "MEMZ.exe was terminated successfully. Phew! That was a close one. Your system is safe (for now).", null, undefined, 'error');
    });

    // Make MEMZ window undraggable and unclosable by default for dramatic effect
    memzWindow.querySelector('.window-title-bar').style.cursor = 'default';
    memzWindow.style.resize = 'none'; // Disable resizing
    memzWindow.querySelector('.window-buttons .close').style.display = 'none'; // Hide default close button
    memzWindow.querySelector('.window-buttons .minimize-button').style.display = 'none';
    memzWindow.querySelector('.window-buttons .maximize-button').style.display = 'none';

}

// --- Error Generator App ---
function launchErrorGeneratorApp() {
    const content = `
        <div style="padding: 20px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
            <img src="/error-cancel-abort-icon.png" alt="Error" style="width: 80px; height: 80px; margin-bottom: 20px;">
            <p id="error-message" style="color: #f00; font-size: 1.1em; margin-bottom: 25px;">Click the button to simulate an error!</p>
            <button id="trigger-error-button" style="background-color: #e81123; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 1.1em;">
                Trigger Error
            </button>
        </div>
    `;
    const errorWindow = createWindow('error-generator-app', 'Error Generator', content, { width: 450, height: 300, top: 100, left: 600 });

    const errorMessageElem = errorWindow.querySelector('#error-message');
    const triggerButton = errorWindow.querySelector('#trigger-error-button');

    const errorMessages = [
        "ERROR: Critical process died.",
        "System failure: Data corruption detected.",
        "Application crashed: Access violation at address 0x0000000.",
        "Warning: Insufficient memory to complete operation.",
        "Unexpected error: Kernel security check failure.",
        "File not found: C:\\Windows\\temp\\nonexistent.dll",
        "Connection lost: Network cable unplugged."
    ];

    triggerButton.addEventListener('click', () => {
        const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        createSystemDialog('gen-error-sim', 'System Error', randomError, '/error-cancel-abort-icon.png', undefined, 'error');
        errorMessageElem.textContent = `Last Error: ${randomError}`;
    });
}

// --- Winver App ---
function launchWinverApp() {
    const content = `
        <div style="display: flex; flex-direction: column; align-items: center; padding: 20px; text-align: center;">
            <img src="/Windows_8_logo.png" alt="Windows Logo" style="width: 150px; height: auto; margin-bottom: 20px;">
            <h2 style="margin-bottom: 10px;">About Windows</h2>
            <p style="font-size: 1em; color: #ccc;">Microsoft Windows<br>Version 22H2 (OS Build 19045.3996)</p>
            <p style="font-size: 0.9em; color: #aaa;"> 2024 Microsoft Corporation. All rights reserved.</p>
            <p style="font-size: 0.8em; color: #777; margin-top: 15px;">
                The Windows 10 Home operating system and its user interface are protected by trademark and other pending or existing intellectual property rights in the U.S. and other countries/regions.
            </p>
            <button style="margin-top: 20px; padding: 8px 20px; background-color: #0078d4; color: white; border: none; border-radius: 3px; cursor: pointer;" onclick="document.getElementById('winver-app').remove();">OK</button>
        </div>
    `;
    createWindow('winver-app', 'About Windows', content, { width: 500, height: 450, top: 150, left: 300 });
}

// --- YouTube App ---
function launchYoutubeApp() {
    const defaultVideoId = 'dQw4w9WgXcQ'; // Rick Astley - Never Gonna Give You Up (Classic Rickroll)
    const content = `
        <div style="display: flex; flex-direction: column; height: 100%; padding: 10px;">
            <div style="display: flex; margin-bottom: 10px;">
                <input type="text" id="youtube-url-input" placeholder="Enter YouTube URL or Video ID" style="flex-grow: 1; padding: 8px; border: 1px solid #555; background-color: #333; color: #fff; border-radius: 3px; margin-right: 5px;">
                <button id="youtube-load-button" style="padding: 8px 15px; background-color: #cc0000; color: white; border: none; border-radius: 3px; cursor: pointer;">Load Video</button>
            </div>
            <div id="youtube-player-container" style="flex-grow: 1; position: relative; width: 100%; padding-bottom: 56.25%; /* 16:9 Aspect Ratio */ height: 0; overflow: hidden;">
                <iframe id="youtube-player" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/${defaultVideoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <p style="text-align: center; color: #aaa; font-size: 0.9em; margin-top: 10px;">Powered by YouTube Embeds (some videos may be restricted)</p>
        </div>
    `;
    const youtubeWindow = createWindow('youtube-app', 'YouTube', content, { width: 800, height: 600, top: 100, left: 200 });

    const urlInput = youtubeWindow.querySelector('#youtube-url-input');
    const loadButton = youtubeWindow.querySelector('#youtube-load-button');
    const youtubePlayer = youtubeWindow.querySelector('#youtube-player');

    function loadYoutubeVideo() {
        let input = urlInput.value.trim();
        let videoId = '';

        if (input.includes('youtube.com/watch?v=')) {
            const urlParams = new URLSearchParams(input.split('?')[1]);
            videoId = urlParams.get('v');
        } else if (input.includes('youtu.be/')) {
            videoId = input.split('youtu.be/')[1].split('?')[0];
        } else {
            // Assume it's just a video ID
            videoId = input;
        }

        if (videoId) {
            youtubePlayer.src = `https://www.youtube.com/embed/${videoId}`;
        } else {
            createSystemDialog('youtube-error', 'YouTube Error', 'Please enter a valid YouTube URL or Video ID.', '/error-cancel-abort-icon.png', undefined, 'error');
        }
    }

    loadButton.addEventListener('click', loadYoutubeVideo);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loadYoutubeVideo();
        }
    });
}

// --- VirtualBox App ---
function launchVirtualBoxApp() {
    const content = `
        <div style="padding: 20px; text-align: center;">
            <h2>Your Virtual Machines</h2>
            <div style="display: flex; flex-direction: column; gap: 15px; margin-top: 20px;">
                <button class="vm-button" data-vm-name="Windows XP" data-vm-url="https://windows-xp.on.websim.com/">
                    <img src="/Windows_8_logo.png" alt="Windows XP Icon" style="width: 48px; height: 48px; margin-right: 10px;">
                    <span>Windows XP</span>
                </button>
                <button class="vm-button" data-vm-name="Windows 7" data-vm-url="https://windows-2--alivegazelle7737247.on.websim.com/">
                    <img src="/Windows_8_logo.png" alt="Windows 7 Icon" style="width: 48px; height: 48px; margin-right: 10px;">
                    <span>Windows 7</span>
                </button>
            </div>
            <p style="margin-top: 30px; font-size: 0.9em; color: #aaa;">Click a VM to launch it in a new window.</p>
        </div>
    `;
    const vboxWindow = createWindow('virtualbox-app', 'VirtualBox', content, { width: 500, height: 400, top: 150, left: 300 });

    vboxWindow.querySelectorAll('.vm-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const vmName = e.currentTarget.dataset.vmName;
            const vmUrl = e.currentTarget.dataset.vmUrl;
            launchVMWindow(vmName, vmUrl);
        });
    });
}

function launchVMWindow(vmName, vmUrl) {
    const content = `
        <div style="flex-grow: 1; position: relative; width: 100%; height: 100%; overflow: hidden;">
            <iframe src="${vmUrl}" frameborder="0" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" allowfullscreen></iframe>
        </div>
        <div style="text-align: center; color: #aaa; font-size: 0.8em; padding-top: 10px;">
            Simulating ${vmName} environment. Content provided by WebSim.
        </div>
    `;
    createWindow(`vm-window-${vmName.replace(/\s/g, '-')}`, `Virtual Machine: ${vmName}`, content, {
        width: 1024,
        height: 768,
        top: 75,
        left: 200
    });
}

// --- Control Panel App ---
function launchControlPanelApp() {
    if (isWindowsME) {
        createSystemDialog('cp-me-error', 'Control Panel Error', 'Control Panel functionality is limited in Windows ME. Please upgrade to a newer OS for full features.', '/error-cancel-abort-icon.png', undefined, 'error');
        return;
    }

    const wallpapers = [
        { name: 'Windows 10 Default', url: '/wallpaper.jpg' },
        { name: 'Abstract Grid', url: '/Wallpaper 10 5.avif' },
        { name: 'Super Mario Pattern', url: '/supermario64.png' },
        { name: 'Autumn Mountains', url: '/wp7510702-macos-high-sierra-wallpapers.jpg' }
    ];

    let wallpaperHtml = '';
    wallpapers.forEach(wp => {
        const isActive = currentWallpaper === wp.url ? 'active' : '';
        wallpaperHtml += `
            <div class="wallpaper-item ${isActive}" data-wallpaper-url="${wp.url}">
                <img src="${wp.url}" alt="${wp.name} preview">
                <span>${wp.name}</span>
            </div>
        `;
    });

    const content = `
        <div style="padding: 10px 20px; border-bottom: 1px solid #4a4a4a;">
            <h2 style="margin: 0; font-size: 1.5em; color: #fff;">Personalization <span style="font-weight: normal; font-size: 0.7em;">> Background</span></h2>
        </div>
        <div style="padding: 20px;">
            <p style="margin-top: 0; color: #ccc;">Choose your desktop background:</p>
            <div class="wallpaper-grid">
                ${wallpaperHtml}
            </div>
            <p style="margin-top: 20px; font-size: 0.9em; color: #aaa;">Click on an image to set it as your desktop background.</p>
        </div>
    `;
    const cpWindow = createWindow('control-panel-app', 'Control Panel - Personalization', content, { width: 700, height: 600, top: 100, left: 250 });

    cpWindow.querySelectorAll('.wallpaper-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const newWallpaperUrl = item.dataset.wallpaperUrl;
            changeWallpaper(newWallpaperUrl);

            // Update active class
            cpWindow.querySelectorAll('.wallpaper-item').forEach(el => el.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function changeWallpaper(url) {
    document.getElementById('desktop').style.backgroundImage = `url('${url}')`;
    currentWallpaper = url;
}

// --- Minesweeper App ---
function launchMinesweeperApp() {
    const content = `
        <div class="minesweeper-toolbar">
            <span id="mine-counter">💣 10</span>
            <button id="reset-button">😊</button>
            <span id="time-counter">⏱ 0</span>
        </div>
        <div id="minesweeper-grid" class="minesweeper-grid"></div>
    `;
    createWindow('minesweeper-app', 'Minesweeper', content, { width: 320, height: 380, top: 150, left: 300 });
    initMinesweeper();
}

function initMinesweeper() {
    const ROWS = 9, COLS = 9, MINES = 10;
    let board = [], revealed = [], flagged = [], minePositions = [];
    let gameOver = false, firstClick = true;

    const grid = document.getElementById('minesweeper-grid');
    const resetBtn = document.getElementById('reset-button');
    const timeSpan = document.getElementById('time-counter');
    const mineSpan = document.getElementById('mine-counter');

    let timer = 0, timerInterval;

    function createBoard() {
        grid.innerHTML = '';
        grid.style.gridTemplateColumns = `repeat(${COLS}, 30px)`;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const cell = document.createElement('div');
                cell.dataset.r = r; cell.dataset.c = c;
                cell.className = 'minesweeper-cell';
                cell.addEventListener('click', () => clickCell(r, c));
                cell.addEventListener('contextmenu', (e) => { e.preventDefault(); toggleFlag(r, c); });
                grid.appendChild(cell);
            }
            board[r] = new Array(COLS).fill(0);
            revealed[r] = new Array(COLS).fill(false);
            flagged[r] = new Array(COLS).fill(false);
        }
    }

    function placeMines(excludeR, excludeC) {
        let placed = 0;
        while (placed < MINES) {
            const r = Math.floor(Math.random() * ROWS);
            const c = Math.floor(Math.random() * COLS);
            if (board[r][c] !== 9 && !(r === excludeR && c === excludeC)) {
                board[r][c] = 9;
                placed++;
            }
        }
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (board[r][c] === 9) continue;
                let count = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr, nc = c + dc;
                        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc] === 9) count++;
                    }
                }
                board[r][c] = count;
            }
        }
    }

    function renderCell(r, c) {
        const cell = grid.children[r * COLS + c];
        if (revealed[r][c]) {
            cell.textContent = board[r][c] === 0 ? '' : board[r][c];
            cell.classList.add('revealed');
            if (board[r][c] === 9) cell.textContent = '💣';
        } else if (flagged[r][c]) {
            cell.textContent = '🚩';
        } else {
            cell.textContent = '';
        }
    }

    function clickCell(r, c) {
        if (gameOver || revealed[r][c] || flagged[r][c]) return;
        if (firstClick) {
            placeMines(r, c);
            firstClick = false;
            startTimer();
        }
        reveal(r, c);
        checkWin();
    }

    function reveal(r, c) {
        if (r < 0 || r >= ROWS || c < 0 || c >= COLS || revealed[r][c] || flagged[r][c]) return;
        revealed[r][c] = true;
        renderCell(r, c);
        if (board[r][c] === 9) {
            gameOver = true; 
            clearInterval(timerInterval);
            resetBtn.textContent = '😵';

            revealAll();
            createSystemDialog('minesweeper-game-over', 'Game Over', `Minesweeper: Game Over! Your time: ${timer}s`, '/error-cancel-abort-icon.png', undefined, 'error');
        } else if (board[r][c] === 0) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) reveal(r + dr, c + dc);
            }
        }
    }

    function toggleFlag(r, c) {
        if (gameOver || revealed[r][c]) return;
        flagged[r][c] = !flagged[r][c];
        renderCell(r, c);
        updateMineCounter();
    }

    function revealAll() {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                revealed[r][c] = true; renderCell(r, c);
            }
        }
    }

    function checkWin() {
        let revealedCount = 0;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) if (revealed[r][c]) revealedCount++;
        }
        if (revealedCount === ROWS * COLS - MINES) {
            gameOver = true; 
            clearInterval(timerInterval);
            resetBtn.textContent = '😎';

            createSystemDialog('minesweeper-win', 'Congratulations!', `You won! Your time: ${timer}s`, null, undefined, 'info');
        }
    }

    function startTimer() {
        timerInterval = setInterval(() => { timer++; timeSpan.textContent = `  ${timer}`; }, 1000);
    }

    function updateMineCounter() {
        let flagCount = 0;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) if (flagged[r][c]) flagCount++;
        }
        mineSpan.textContent = ` ${MINES - flagCount}`;
    }

    resetBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        timer = 0; timeSpan.textContent = '  0';
        resetBtn.textContent = '';
        gameOver = false; firstClick = true;
        createBoard();
        updateMineCounter();
    });

    createBoard();
    updateMineCounter();
}


// --- MS Paint App ---
function launchMSPaintApp() {
    const appId = 'ms-paint-app';
    appStates[appId] = { isDirty: false, filename: 'Untitled.png', saveFunction: null };

    const content = `
        <div class="paint-sidebar">
            <button class="tool-button" id="tool-save" title="Save">💾</button>
            <button class="tool-button" id="tool-clear" title="Clear All">🧹</button>
            <button class="tool-button active" id="tool-pen" title="Pen">✏️</button>
            <button class="tool-button" id="tool-eraser" title="Eraser">🧼</button>
            <button class="tool-button" id="tool-fill" title="Fill">🪣</button>
            <button class="tool-button" id="tool-text" title="Text">🅰️</button>
        </div>
        <div class="paint-main-area">
            <div class="paint-top-bar">
                <label for="paint-font-select">Font:</label>
                <select id="paint-font-select">
                    <option value="Segoe UI">Segoe UI</option>
                    <option value="Arial">Arial</option>
                    <option value="Comic Sans MS">Comic Sans MS</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                </select>
            </div>
            <div class="paint-canvas-container">
                <canvas id="paint-canvas"></canvas>
            </div>
            <div class="paint-bottom-bar">
                <div class="color-palette">
                <div class="color-swatch active" style="background-color: black;" data-color="black"></div>
                <div class="color-swatch" style="background-color: white;" data-color="white"></div>
                <div class="color-swatch" style="background-color: red;" data-color="red"></div>
                <div class="color-swatch" style="background-color: green;" data-color="green"></div>
                <div class="color-swatch" style="background-color: blue;" data-color="blue"></div>
                <div class="color-swatch" style="background-color: yellow;" data-color="yellow"></div>
                <div class="color-swatch" style="background-color: purple;" data-color="purple"></div>
                <div class="color-swatch" style="background-color: orange;" data-color="orange"></div>
                <div class="color-swatch custom-color-swatch" id="custom-color-swatch" style="background-color: #ffffff; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px;" title="Custom Color">
                    <span style="filter: invert(1); pointer-events: none;">?</span>
                    <input type="color" id="paint-custom-color" style="opacity: 0; position: absolute; top: 0; left: 0; width: 100%; height: 100%; cursor: pointer;">
                </div>
            </div>
            <input type="range" id="size-slider" class="size-slider" min="1" max="20" value="5">
            <span id="current-size-display" style="color: #333;">5px</span>
        </div>
    `;
    const paintWindow = createWindow('ms-paint-app', 'MS Paint', content, { width: 700, height: 550, top: 100, left: 200, icon: '/Paint.png' });

    const canvas = paintWindow.querySelector('#paint-canvas');
    const ctx = canvas.getContext('2d');
    const toolButtons = paintWindow.querySelectorAll('.tool-button');
    const colorSwatches = paintWindow.querySelectorAll('.color-swatch');
    const sizeSlider = paintWindow.querySelector('#size-slider');
    const currentSizeDisplay = paintWindow.querySelector('#current-size-display');
    const saveButton = paintWindow.querySelector('#tool-save');
    const clearButton = paintWindow.querySelector('#tool-clear');
    const customColorInput = paintWindow.querySelector('#paint-custom-color');
    const customColorSwatch = paintWindow.querySelector('#custom-color-swatch');
    const fontSelect = paintWindow.querySelector('#paint-font-select');

    const canvasContainer = paintWindow.querySelector('.paint-canvas-container');

    // Canvas sizing setup
    function resizeCanvasToContainer() {
        if (!canvasContainer) return;

        const width = canvasContainer.clientWidth;
        const height = canvasContainer.clientHeight;

        if (width <= 0 || height <= 0) return;

        // Save content
        let tempImage = null;
        if (canvas.width > 0 && canvas.height > 0) {
            try {
                tempImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
            } catch (e) {
                tempImage = null;
            }
        }

        canvas.width = width;
        canvas.height = height;

        // Fill white background by default
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (tempImage) {
            ctx.putImageData(tempImage, 0, 0);
        }
    }

    // Initial size
    setTimeout(resizeCanvasToContainer, 0);

    // Watch for container resizes
    const resizeObserver = new ResizeObserver(() => {
        resizeCanvasToContainer();
    });
    resizeObserver.observe(canvasContainer);

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentTool = 'pen'; // pen, eraser, fill, text
    let currentColor = 'black';
    let currentSize = 5; // Default pen/eraser size
    let currentFontFamily = 'Segoe UI';

    // Set initial canvas background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save function
    function saveDrawing() {
        const filename = prompt("Save as:", appStates[appId].filename);
        if (!filename) return;

        const dataUrl = canvas.toDataURL('image/png');
        fileSystem['C:'].contents['Saved Items'].contents[filename] = {
            type: 'file',
            fileType: 'image',
            content: dataUrl
        };
        appStates[appId].isDirty = false;
        appStates[appId].filename = filename;
        paintWindow.querySelector('.window-title').textContent = `${filename} - MS Paint`;
        createSystemDialog('paint-saved', 'Saved', `Drawing saved as ${filename}`, null, [{text: 'OK'}], 'info');
    }
    appStates[appId].saveFunction = saveDrawing;
    saveButton.addEventListener('click', saveDrawing);

    // Clear canvas with confirmation
    function clearCanvas() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        appStates[appId].isDirty = true;
    }

    clearButton.addEventListener('click', () => {
        createSystemDialog(
            'paint-clear-confirm',
            'Clear Canvas',
            'Are you sure you want to clear the entire canvas? This cannot be undone.',
            '/warning.png',
            [
                {
                    text: 'Clear',
                    callback: () => clearCanvas()
                },
                {
                    text: 'Cancel',
                    class: 'secondary',
                    callback: () => {}
                }
            ],
            'warning'
        );
    });

    // Function to get mouse position relative to canvas
    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    // Drawing functions
    function draw(x, y) {
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    function erase(x, y) {
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    function colorToRgb(color) {
        const tempDiv = document.createElement('div');
        tempDiv.style.color = color;
        document.body.appendChild(tempDiv);
        const style = window.getComputedStyle(tempDiv).color;
        document.body.removeChild(tempDiv);
        const match = style.match(/\d+/g);
        return match ? { r: parseInt(match[0]), g: parseInt(match[1]), b: parseInt(match[2]) } : { r: 0, g: 0, b: 0 };
    }

    function floodFill(startX, startY, newColor) {
        // Clamp coordinates inside canvas
        startX = Math.max(0, Math.min(Math.floor(startX), canvas.width - 1));
        startY = Math.max(0, Math.min(Math.floor(startY), canvas.height - 1));

        const targetColorData = ctx.getImageData(startX, startY, 1, 1).data;
        const targetColor = { r: targetColorData[0], g: targetColorData[1], b: targetColorData[2], a: targetColorData[3] };
        const newRgb = colorToRgb(newColor);
        
        if (targetColor.r === newRgb.r && targetColor.g === newRgb.g && targetColor.b === newRgb.b && targetColor.a === 255) {
            return;
        }

        const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const width = canvas.width;
        const height = canvas.height;
        const stack = [[startX, startY]];

        while (stack.length > 0) {
            const [x, y] = stack.pop();
            const index = (y * width + x) * 4;

            if (x >= 0 && x < width && y >= 0 && y < height &&
                pixelData.data[index] === targetColor.r &&
                pixelData.data[index + 1] === targetColor.g &&
                pixelData.data[index + 2] === targetColor.b &&
                pixelData.data[index + 3] === targetColor.a) {

                pixelData.data[index] = newRgb.r;
                pixelData.data[index + 1] = newRgb.g;
                pixelData.data[index + 2] = newRgb.b;
                pixelData.data[index + 3] = 255;

                stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
            }
        }
        ctx.putImageData(pixelData, 0, 0);
        appStates[appId].isDirty = true;
    }

    function drawTextAtPosition(x, y) {
        const text = prompt('Enter text:');
        if (!text) return;
        ctx.save();
        ctx.fillStyle = currentColor;
        ctx.font = `${Math.max(12, currentSize * 3)}px "${currentFontFamily}"`;
        ctx.textBaseline = 'top';
        ctx.fillText(text, x, y);
        ctx.restore();
        appStates[appId].isDirty = true;
    }

    // Event Listeners
    canvas.addEventListener('mousedown', (e) => {
        const pos = getMousePos(e);

        if (currentTool === 'fill') {
            appStates[appId].isDirty = true;
            floodFill(pos.x, pos.y, currentColor);
            return;
        }

        if (currentTool === 'text') {
            drawTextAtPosition(pos.x, pos.y);
            return;
        }

        appStates[appId].isDirty = true;
        isDrawing = true;
        lastX = pos.x;
        lastY = pos.y;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        const pos = getMousePos(e);
        ctx.lineWidth = currentSize;
        ctx.lineCap = 'round';

        if (currentTool === 'pen') {
            ctx.strokeStyle = currentColor;
            draw(pos.x, pos.y);
        } else if (currentTool === 'eraser') {
            ctx.strokeStyle = 'white'; // Eraser draws with white
            erase(pos.x, pos.y);
        }
        lastX = pos.x;
        lastY = pos.y;
    });

    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        ctx.closePath();
    });

    canvas.addEventListener('mouseout', () => {
        isDrawing = false;
        ctx.closePath();
    });

    // Tool selection (exclude clear/save from drawing tool mode)
    toolButtons.forEach(button => {
        const id = button.id;
        if (id === 'tool-clear' || id === 'tool-save') return;

        button.addEventListener('click', () => {
            toolButtons.forEach(btn => {
                const bid = btn.id;
                if (bid === 'tool-clear' || bid === 'tool-save') return;
                btn.classList.remove('active');
            });
            button.classList.add('active');
            currentTool = id.replace('tool-', '');
        });
    });

    // Font selection
    fontSelect.addEventListener('change', (e) => {
        currentFontFamily = e.target.value;
    });

    // Color selection
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', (e) => {
            if (swatch.id === 'custom-color-swatch' && e.target !== customColorInput) {
                customColorInput.click();
            }
            colorSwatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            
            if (swatch.id === 'custom-color-swatch') {
                currentColor = customColorInput.value;
            } else {
                currentColor = swatch.dataset.color;
            }
        });
    });

    customColorInput.addEventListener('input', (e) => {
        currentColor = e.target.value;
        customColorSwatch.style.backgroundColor = currentColor;
        colorSwatches.forEach(s => s.classList.remove('active'));
        customColorSwatch.classList.add('active');
    });

    // Size slider
    sizeSlider.addEventListener('input', (e) => {
        currentSize = parseInt(e.target.value, 10);
        currentSizeDisplay.textContent = `${currentSize}px`;
    });

    // Play music when app opens
    playMarioPaintMusic();
}


// --- Blue Screen of Death (BSOD) Simulation ---
function triggerBSOD() {
    // Hide all existing desktop elements and windows
    document.getElementById('desktop').style.display = 'none';
    document.getElementById('taskbar').style.display = 'none';
    document.getElementById('start-menu').classList.remove('show');
    document.getElementById('start-menu').classList.add('hidden');
    Array.from(windowContainer.children).forEach(win => win.remove());
    // Remove any active system dialogs
    Array.from(document.querySelectorAll('.system-dialog')).forEach(dialog => dialog.remove());

    // Stop any playing music (e.g., Mario Paint)
    stopMarioPaintMusic();

    const bsodScreen = createElement('div', '', 'bsod-screen');
    bsodScreen.innerHTML = `
        <div class="sad-face">:(</div>
        <h1>Your PC ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.</h1>
        <p>For more information about this issue and possible fixes, visit <span style="color: #6cf;">https://www.windows.com/stopcode</span></p>
        <div class="error-code">Stop Code: SYSTEM_SERVICE_EXCEPTION</div>
        <div class="qr-code">
            <p>Simulated QR Code<br>for Diagnostics</p>
        </div>
        <div style="margin-top: 30px; font-size: 0.8em;">0% complete</div>
        <div style="margin-top: 10px; font-size: 0.8em;">(Simulated progress bar would go here)</div>
    `;

    document.body.appendChild(bsodScreen);

    // Disable all further interactions
    document.body.style.pointerEvents = 'none';
    document.body.style.cursor = 'none';

    // Simulate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 1;
        if (progress > 100) {
            clearInterval(progressInterval);
            bsodScreen.querySelector('div:last-of-type').textContent = 'Restarting...';
            // Simulate restart (e.g., reload the page)
            setTimeout(() => {
                location.reload();
            }, 3000);
            return;
        }
        bsodScreen.querySelector('div:last-of-type').textContent = `${progress}% complete`;
    }, 100);
}

// --- Windows ME Downgrade Simulation ---
function initiateMEDowngrade() {
    isWindowsME = true; // Set flag
    // Hide all Windows 10 elements
    document.getElementById('desktop').style.display = 'none';
    document.getElementById('taskbar').style.display = 'none';
    document.getElementById('start-menu').classList.remove('show');
    document.getElementById('start-menu').classList.add('hidden');
    Array.from(windowContainer.children).forEach(win => win.remove()); // Close all open windows
    // Remove any active system dialogs
    Array.from(document.querySelectorAll('.system-dialog')).forEach(dialog => dialog.remove());

    // Stop any playing music (e.g., Mario Paint)
    stopMarioPaintMusic();

    // Create the downgrade overlay
    const downgradeOverlay = createElement('div', '', 'downgrade-overlay');
    downgradeOverlay.innerHTML = `<p>Downgrading to Windows ME...</p>`;
    document.body.appendChild(downgradeOverlay);

    // Simulate downgrade progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        if (progress <= 100) {
            downgradeOverlay.innerHTML = `<p>Downgrading to Windows ME... ${progress}%</p>`;
        } else {
            clearInterval(interval);
            // Show Windows ME logo
            downgradeOverlay.innerHTML = `<img src="/dhggmui-1d7fcc55-bf4b-4c75-8197-0134c9005ef9.png" alt="Windows ME Logo" style="max-width: 400px; max-height: 400px; animation: fadeIn 2s forwards;">`;
            const meStartupSound = new Audio('/startup.mp3'); // Windows 95 startup sound
            meStartupSound.volume = 0.7;
            meStartupSound.play().catch(e => console.error("Error playing ME startup sound:", e));

            setTimeout(() => {
                // Transition to Windows ME desktop
                downgradeOverlay.classList.add('windows-me-desktop'); // This will apply the ME desktop background image via CSS
                downgradeOverlay.innerHTML = ''; // Clear logo
                downgradeOverlay.style.pointerEvents = 'auto'; // Re-enable pointer events for the ME desktop area
                downgradeOverlay.style.cursor = 'default'; // Reset cursor
                
                // Immediately launch the first ME error
                const firstMeError = launchMEError(); // Get a reference to the first ME error window element

                // Add a click listener to the overlay for the second error, AFTER the first one appears
                const desktopClickListener = () => {
                    // Check if the first ME error window is no longer in the DOM
                    // This uses parentElement to check if the element is still attached to the document.
                    if (!firstMeError.parentElement) {
                        launchSystem32NotFoundError();
                        // Remove this listener once triggered to prevent multiple System32 errors
                        downgradeOverlay.removeEventListener('click', desktopClickListener);
                    }
                };
                downgradeOverlay.addEventListener('click', desktopClickListener);

            }, 3000); // Display logo for 3 seconds
        }
    }, 500); // Update progress every 0.5 seconds for 5 seconds total for 100%

    // Disable all other body interactions during downgrade
    document.body.style.pointerEvents = 'none';
    document.body.style.cursor = 'none';
}

function launchMEError() {
    const meErrorWindow = createElement('div', 'me-error-window');
    meErrorWindow.innerHTML = `
        <div class="title-bar">
            <span>Critical Error</span>
            <div class="close-button">X</div>
        </div>
        <div class="content">
            <img src="/warning.png" alt="Warning Icon">
            <p>HAHAH! Have fun with windows me!</p>
        </div>
        <div class="ok-button-container">
            <button class="ok-button">OK</button>
        </div>
    `;

    document.getElementById('downgrade-overlay').appendChild(meErrorWindow);

    // Make ME error window buttons clickable
    meErrorWindow.querySelector('.close-button').addEventListener('click', () => {
        meErrorWindow.remove();
    });
    meErrorWindow.querySelector('.ok-button').addEventListener('click', () => {
        meErrorWindow.remove();
    });

    // Make ME error window non-draggable
    meErrorWindow.querySelector('.title-bar').style.cursor = 'default';
    meErrorWindow.style.resize = 'none';
    
    return meErrorWindow; // Return the created window element
}

function launchSystem32NotFoundError() {
    const system32ErrorWindow = createElement('div', 'me-error-window'); // Use the same ME style
    system32ErrorWindow.innerHTML = `
        <div class="title-bar">
            <span>System Error</span>
            <div class="close-button">X</div>
        </div>
        <div class="content">
            <img src="/error-cancel-abort-icon.png" alt="Error Icon">
            <p>System32 cannot be found.</p>
        </div>
        <div class="ok-button-container">
            <button class="ok-button">OK</button>
        </div>
    `;

    document.getElementById('downgrade-overlay').appendChild(system32ErrorWindow);

    // Clicking OK or X on this error triggers BSOD
    system32ErrorWindow.querySelector('.close-button').addEventListener('click', () => {
        system32ErrorWindow.remove();
        triggerBSOD();
    });
    system32ErrorWindow.querySelector('.ok-button').addEventListener('click', () => {
        system32ErrorWindow.remove();
        triggerBSOD();
    });

    // Make non-draggable
    system32ErrorWindow.querySelector('.title-bar').style.cursor = 'default';
    system32ErrorWindow.style.resize = 'none';
}

function triggerSystem32Deletion() {
    let delay = 0;
    const increment = 2000; // 2 seconds between dialogs

    // 1. Warning
    setTimeout(() => {
        createSystemDialog('sys32-warn1', 'File Explorer', 'Warning: Attempting to delete critical system files. This action cannot be undone.', '/warning.png', [{ text: 'OK' }]);
    }, delay);
    delay += increment;

    // 2. Access Denied Error
    setTimeout(() => {
        createSystemDialog('sys32-error1', 'File Explorer', 'Error: Access denied to C:\\Windows\\System32\\ntoskrnl.exe', '/error-cancel-abort-icon.png', [{ text: 'OK' }], 'error');
    }, delay);
    delay += increment;

    // 3. Critical System Error
    setTimeout(() => {
        const criticalDialog = createSystemDialog('sys32-critical', 'Critical System Error', 'Critical System Error! Some system processes have been unexpectedly terminated.', '/error-cancel-abort-icon.png', [{ text: 'Close All Programs', callback: () => { /* noop, will BSOD anyway */ } }], 'error');
        // This dialog cannot be closed by its 'X' or 'Close All Programs' if the BSOD is imminent
        criticalDialog.querySelector('.dialog-close-button').style.display = 'none'; // Hide X
        criticalDialog.querySelector('.dialog-button').disabled = true; // Disable button temporarily
    }, delay);
    delay += increment;

    // 4. System Unstable / Restart
    setTimeout(() => {
        createSystemDialog('sys32-unstable', 'System Message', 'Your system is unstable. A restart is required. Initiating shutdown...', '/warning.png', [{ text: 'Restart Now', callback: () => triggerBSOD() }], 'warning');
    }, delay);
    delay += increment;

    // 5. Trigger BSOD after all dialogs
    setTimeout(() => {
        triggerBSOD();
    }, delay);
}


// --- Virus Attack Logic ---
function initiateVirusAttack() {
    // Close any open windows first
    Array.from(windowContainer.children).forEach(win => win.remove());

    // Display a "virus installing" message initially
    createSystemDialog('virus-install', 'VIRUS ALERT!', 'Malicious software detected and is taking over your system!', '/memz.webp', [{ text: 'OH NO!' }], 'error');

    setTimeout(() => {
        // Start app disappearance
        hideAppsSequentially(0);
    }, 3000); // 3 seconds after the initial virus alert
}

function hideAppsSequentially(index) {
    if (index >= desktopIcons.length) {
        // All apps hidden, proceed to blank wallpaper
        setTimeout(makeWallpaperBlank, 1000); // 1 second after last app disappears
        return;
    }

    const icon = desktopIcons[index];
    icon.style.transition = 'opacity 0.5s ease-out';
    icon.style.opacity = '0'; // Fade out
    icon.style.pointerEvents = 'none'; // Make it unclickable

    setTimeout(() => {
        icon.style.display = 'none'; // Remove from layout after fade
        hideAppsSequentially(index + 1);
    }, 500); // 0.5 seconds for fade out + 0.5 seconds delay for next app = 1 second total per app
}

function makeWallpaperBlank() {
    const desktop = document.getElementById('desktop');
    desktop.style.transition = 'background-image 1s ease-out, background-color 1s ease-out';
    desktop.style.backgroundImage = 'none';
    desktop.style.backgroundColor = 'black'; // Or white, user implies 'blank'
    desktop.style.cursor = 'none'; // Hide cursor

    setTimeout(() => {
        triggerBSOD();
    }, 2000); // 2 seconds after wallpaper goes blank, then BSOD
}


// --- Desktop Icon Event Listeners ---
document.getElementById('recycle-bin-icon').addEventListener('click', launchRecycleBin);
document.getElementById('edge-icon').addEventListener('click', launchEdgeBrowser);
document.getElementById('store-icon').addEventListener('click', launchMicrosoftStore);
document.getElementById('clippy-icon').addEventListener('click', launchClippyApp);
document.getElementById('file-explorer-desktop-icon').addEventListener('click', launchFileExplorer);
document.getElementById('error-generator-icon').addEventListener('click', launchErrorGeneratorApp);
document.getElementById('virtualbox-icon').addEventListener('click', launchVirtualBoxApp);
document.getElementById('control-panel-icon').addEventListener('click', launchControlPanelApp);
document.getElementById('minesweeper-icon').addEventListener('click', launchMinesweeperApp);
document.getElementById('ms-paint-icon').addEventListener('click', launchMSPaintApp); // New: MS Paint icon listener
document.getElementById('notepad-icon').addEventListener('click', () => launchNotepadApp());
document.getElementById('saved-items-icon').addEventListener('click', launchSavedItemsFolder);


// --- App Launchers ---
function launchNotepadApp(filename = 'Untitled.txt', contentTxt = '') {
    const appId = `notepad-app-${Date.now()}`; // Unique ID for multiple instances
    appStates[appId] = { isDirty: false, filename: filename, saveFunction: null };

    const content = `
        <div style="display:flex;flex-direction:column;height:100%;padding:0;background:#1c1c1c;">
            <div class="file-explorer-toolbar">
                <button id="notepad-save-btn">Save</button>
            </div>
            <textarea id="notepad-textarea" style="flex-grow:1;background:#fff;color:#000;font-family:'Consolas',monospace;font-size:14px;padding:8px;border:none;resize:none;"></textarea>
        </div>
    `;
    const notepadWindow = createWindow(appId, `${filename} - Notepad`, content, { width: 600, height: 400, top: 120, left: 220, icon: '/forbidden.png' });
    
    const textarea = notepadWindow.querySelector('#notepad-textarea');
    const saveButton = notepadWindow.querySelector('#notepad-save-btn');
    
    textarea.value = contentTxt;
    textarea.focus();

    textarea.addEventListener('input', () => {
        appStates[appId].isDirty = true;
    });

    function saveNotepad() {
        const newFilename = prompt("Save as:", appStates[appId].filename);
        if (!newFilename) return;

        const textContent = textarea.value;
        fileSystem['C:'].contents['Saved Items'].contents[newFilename] = {
            type: 'file',
            fileType: 'text',
            content: textContent
        };
        appStates[appId].isDirty = false;
        appStates[appId].filename = newFilename;
        notepadWindow.querySelector('.window-title').textContent = `${newFilename} - Notepad`;
        createSystemDialog('notepad-saved', 'Saved', `File saved as ${newFilename}`, null, [{text: 'OK'}], 'info');
    }

    appStates[appId].saveFunction = saveNotepad;
    saveButton.addEventListener('click', saveNotepad);
}

function launchSavedItemsFolder() {
    const appId = 'saved-items-folder';
    const existingWindow = document.getElementById(appId);
    if (existingWindow) {
        bringToFront(existingWindow);
        return;
    }

    const content = `
        <div class="main-content-area" id="saved-items-content-area" style="padding: 10px; display: flex; flex-wrap: wrap; gap: 10px; align-content: flex-start; height: 100%;">
            <!-- Saved items will be rendered here -->
        </div>
    `;
    
    const savedItemsWindow = createWindow(appId, 'Saved Items', content, {
        width: 500,
        height: 400,
        top: 150,
        left: 150,
        icon: '/file-explorer-folder-libraries-icon-18298.png'
    });

    const contentArea = savedItemsWindow.querySelector('#saved-items-content-area');

    function renderSavedItems() {
        contentArea.innerHTML = '';
        const savedItems = fileSystem['C:'].contents['Saved Items'].contents;

        for (const filename in savedItems) {
            const item = savedItems[filename];
            const itemElement = createElement('div', 'file-item'); // Using file-item style from file explorer
            itemElement.style.width = '90px'; // Consistent styling
            
            let iconSrc = 'https://img.icons8.com/ios-glyphs/48/ffffff/file--v1.png'; // Generic file
            if (item.fileType === 'text') {
                iconSrc = '/forbidden.png'; // Notepad icon
            } else if (item.fileType === 'image') {
                iconSrc = '/photos-icon.png'; // Photos icon
            }

            itemElement.innerHTML = `
                <img src="${iconSrc}" alt="${filename}">
                <span>${filename}</span>
            `;

            // Double click to open
            if (itemElement.dataset.lastClick && (Date.now() - itemElement.dataset.lastClick < 300)) {
                if (item.fileType === 'text') {
                    launchNotepadApp(filename, item.content);
                } else if (item.fileType === 'image') {
                    launchImageViewer(filename, item.content);
                }
            }
            itemElement.dataset.lastClick = Date.now();


            itemElement.addEventListener('dblclick', () => {
                if (item.fileType === 'text') {
                    launchNotepadApp(filename, item.content);
                } else if (item.fileType === 'image') {
                    launchImageViewer(filename, item.content);
                }
            });
            contentArea.appendChild(itemElement);
        }
    }

    function launchImageViewer(filename, dataUrl) {
        const imageAppId = `image-viewer-${Date.now()}`;
        const imageContent = `
            <div style="display:flex; justify-content:center; align-items:center; width:100%; height:100%; background:#111;">
                <img src="${dataUrl}" alt="${filename}" style="max-width:100%; max-height:100%; object-fit:contain;">
            </div>
        `;
        createWindow(imageAppId, filename, imageContent, {
            width: 800,
            height: 600,
            icon: '/photos-icon.png'
        });
    }

    renderSavedItems();

    // Refresh view when window is focused
    savedItemsWindow.addEventListener('focus', renderSavedItems, true);
    savedItemsWindow.addEventListener('mousedown', renderSavedItems, true);

}

// --- Initial Setup ---
renderStartMenu();

// Play Windows startup sound (conditional now)
async function playStartupSound() {
    if (!isWindowsME) { // Only play if not in ME mode
        try {
            const result = await websim.textToSpeech({
                text: "Welcome to Windows.",
                voice: "en-male",
            });
            const audio = new Audio(result.url);
            audio.volume = 0.5; // Lower volume for background effect
            audio.play().catch(e => console.error("Error playing initial startup sound:", e));
        } catch (error) {
            console.error("Error playing startup sound:", error);
        }
    }
}
playStartupSound();