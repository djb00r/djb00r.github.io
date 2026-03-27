const systemStatusDisplay = document.getElementById('system-status-display');
const systemStatusText = document.getElementById('system-status-text');
const systemStatusIcon = document.getElementById('system-status-icon');
const systemStatusDescription = document.getElementById('system-status-description'); // Get description element

const wifiStatusDisplay = document.getElementById('wifi-status-display');
const wifiStatusText = document.getElementById('wifi-status-text');
const wifiStatusIcon = document.getElementById('wifi-status-icon');
const wifiStatusDescription = document.getElementById('wifi-status-description'); // Get description element

const batteryStatusDisplay = document.getElementById('battery-status-display');
const batteryStatusText = document.getElementById('battery-status-text');
const batteryStatusIcon = document.getElementById('battery-status-icon');
const batteryStatusDescription = document.getElementById('battery-status-description'); // Get description element

// Get references for the new Volume status elements
const volumeStatusDisplay = document.getElementById('volume-status-display');
const volumeStatusText = document.getElementById('volume-status-text');
const volumeStatusIcon = document.getElementById('volume-status-icon');
const volumeStatusDescription = document.getElementById('volume-status-description'); // Get description element

// Get references for the new Internet/Browsing status elements
const internetStatusDisplay = document.getElementById('internet-status-display');
const internetStatusText = document.getElementById('internet-status-text');
const internetStatusIcon = document.getElementById('internet-status-icon');
const internetStatusDescription = document.getElementById('internet-status-description'); // Get description element

// Get references for the new Microphone status elements
const microphoneStatusDisplay = document.getElementById('microphone-status-display');
const microphoneStatusText = document.getElementById('microphone-status-text');
const microphoneStatusIcon = document.getElementById('microphone-status-icon');
const microphoneStatusDescription = document.getElementById('microphone-status-description'); // Get description element

// Get references for the new Phone status elements
const phoneStatusDisplay = document.getElementById('phone-status-display');
const phoneStatusText = document.getElementById('phone-status-text');
const phoneStatusIcon = document.getElementById('phone-status-icon');
const phoneStatusDescription = document.getElementById('phone-status-description'); // Get description element

 // Get references for the new MP3 Player status elements
const mp3StatusDisplay = document.getElementById('mp3-status-display');
const mp3StatusText = document.getElementById('mp3-status-text');
const mp3StatusIcon = document.getElementById('mp3-status-icon');
const mp3StatusDescription = document.getElementById('mp3-status-description'); // Get description element

// Get references for the new Camera status elements
const cameraStatusDisplay = document.getElementById('camera-status-display');
const cameraStatusText = document.getElementById('camera-status-text');
const cameraStatusIcon = document.getElementById('camera-status-icon');
const cameraStatusDescription = document.getElementById('camera-status-description'); // Get description element

// Get references for the new Console status elements
const consoleStatusDisplay = document.getElementById('console-status-display');
const consoleStatusText = document.getElementById('console-status-text');
const consoleStatusIcon = document.getElementById('console-status-icon');
const consoleStatusDescription = document.getElementById('console-status-description');

// Get references for MP3 Player buttons (controls)
const mp3Buttons = mp3StatusDisplay ? mp3StatusDisplay.closest('.status-section').querySelectorAll('.controls button') : [];

// Get references for the new TV status elements
const tvStatusDisplay = document.getElementById('tv-status-display');
const tvStatusText = document.getElementById('tv-status-text');
const tvStatusIcon = document.getElementById('tv-status-icon');
const tvStatusDescription = document.getElementById('tv-status-description');

// Get references for the new Trash Can status elements
const trashStatusDisplay = document.getElementById('trash-status-display');
const trashStatusText = document.getElementById('trash-status-text');
const trashStatusIcon = document.getElementById('trash-status-icon');
const trashStatusDescription = document.getElementById('trash-status-description');

 // Get references to ALL buttons using a more robust selection method
 // Find the parent section for each display, then find the buttons within its controls
 const systemButtons = systemStatusDisplay.closest('.status-section').querySelectorAll('.controls button');
 const wifiButtons = wifiStatusDisplay.closest('.status-section').querySelectorAll('.controls button');
 const batteryButtons = batteryStatusDisplay.closest('.status-section').querySelectorAll('.controls button');
 // Get references for the new Volume buttons
 const volumeButtons = volumeStatusDisplay.closest('.status-section').querySelectorAll('.controls button');
 // Get references for the new Internet/Browsing buttons
 const internetButtons = internetStatusDisplay.closest('.status-section').querySelectorAll('.controls button');
 // Get references for the new Microphone buttons
 const microphoneButtons = microphoneStatusDisplay.closest('.status-section').querySelectorAll('.controls button');
 // Get references for the new Phone buttons
 const phoneButtons = phoneStatusDisplay.closest('.status-section').querySelectorAll('.controls button');
 // Get references for the new MP3 Player buttons
 const mp3ButtonsLocal = mp3StatusDisplay ? mp3StatusDisplay.closest('.status-section').querySelectorAll('.controls button') : [];
 // Get references for the new Camera buttons
 const cameraButtons = cameraStatusDisplay.closest('.status-section').querySelectorAll('.controls button');
 // Get references for the new Console buttons
 const consoleButtons = consoleStatusDisplay.closest('.status-section').querySelectorAll('.controls button');
 // Get references for the new TV buttons
 const tvButtons = tvStatusDisplay.closest('.status-section').querySelectorAll('.controls button');
 // Get references for the new Trash Can buttons
 const trashButtons = trashStatusDisplay.closest('.status-section').querySelectorAll('.controls button');

// HTTP status elements and buttons
const httpStatusDisplay = document.getElementById('http-status-display');
const httpStatusText = document.getElementById('http-status-text');
const httpStatusIcon = document.getElementById('http-status-icon');
const httpStatusDescription = document.getElementById('http-status-description');
const httpButtons = httpStatusDisplay ? httpStatusDisplay.closest('.status-section').querySelectorAll('.controls button') : [];

let audioContext;

// Function to ensure AudioContext is resumed (important for some browsers)
function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // Resume context if it's suspended (e.g., due to auto-play policies)
        if (audioContext.state === 'suspended') {
            const unlock = function() {
                audioContext.resume().then(function() {
                    document.body.removeEventListener('touchstart', unlock);
                    document.body.removeEventListener('click', unlock);
                });
            };
            // Add event listeners to body to resume context on user interaction
            document.body.addEventListener('touchstart', unlock, false);
            document.body.addEventListener('click', unlock, false);
        }
    }
    return audioContext;
}

// Function to load and play sound using Web Audio API
async function playSound(url) {
    // Only attempt to play if a url is provided
    if (!url) {
        return;
    }

    try {
        const context = getAudioContext();
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await context.decodeAudioData(arrayBuffer);

        const source = context.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(context.destination);
        source.start(0);

    } catch (error) {
        console.error('Error playing sound:', error);
    }
}

// Generic function to set status for any display area
// Updated function signature to include descriptionElement and descriptionText
function setStatus(displayElement, mainTextElement, iconElement, descriptionElement, statusClass, statusText, iconCode, descriptionText, soundFile = null) {
    // Remove all status classes from the element, except the base 'status' class
    displayElement.className = 'status';

    // Add the new status class
    if (statusClass) {
         displayElement.classList.add(statusClass);
    } else {
         displayElement.classList.add('initial'); // Default to initial if no class is provided
    }

    // Update text
    mainTextElement.textContent = statusText;

    // Update icon
    iconElement.textContent = iconCode;

    // Update description text
    descriptionElement.textContent = descriptionText;

    // Play sound if a soundFile is provided for THIS status change
    if (soundFile) {
         playSound(soundFile);
    }
}

// Map button IDs to status data (class, text, icon, description, soundFile)
const statusMap = {
    // System Statuses
    'btn-system-ok': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-ok', statusText: 'System Status: OK', iconCode: 'check_circle', descriptionText: 'System is operating normally.', sound: 'ok.mp3' },
    'btn-system-warning': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-warning', statusText: 'System Status: Warning', iconCode: 'warning', descriptionText: 'A non-critical issue has been detected.', sound: 'warning.mp3' },
    'btn-system-error': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-error', statusText: 'System Status: Error', iconCode: 'dangerous', descriptionText: 'A critical error has occurred.', sound: 'error.mp3' },
    'btn-system-notfound': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-notfound', statusText: 'System Status: Not Found', iconCode: 'help_outline', descriptionText: 'Required system components not detected.', sound: 'notfound.mp3' },
    'btn-system-locked': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-locked', statusText: 'System Status: Locked', iconCode: 'lock', descriptionText: 'System access is restricted.', sound: 'locked.mp3' },
    'btn-system-infected': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-infected', statusText: 'System Status: Infected', iconCode: 'bug_report', descriptionText: 'Malware or virus detected.', sound: 'infected.mp3' },
    'btn-system-initial': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'initial', statusText: 'Initializing...', iconCode: 'report', descriptionText: 'System is starting up and performing initial checks.', sound: 'booting.mp3' },
    'btn-system-scanning': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-scanning', statusText: 'System Status: Deep Scanning', iconCode: 'find_replace', descriptionText: 'Performing a deep scan for issues.', sound: 'scanning.mp3' },
    'btn-system-standby': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-standby', statusText: 'System Status: Standby', iconCode: 'power_settings_new', descriptionText: 'System is in a low-power state.', sound: 'standby.mp3' },
    'btn-system-maintenance': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-maintenance', statusText: 'System Status: Maintenance', iconCode: 'construction', descriptionText: 'System is undergoing scheduled maintenance.', sound: 'maintenance.mp3' },
    'btn-system-offline': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-offline', statusText: 'System Status: Offline', iconCode: 'cloud_off', descriptionText: 'System is not connected to any network.', sound: 'offline.mp3' },
    'btn-system-online': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-online', statusText: 'System Status: Online', iconCode: 'signal_cellular_alt', descriptionText: 'System is connected to the network.', sound: 'ok.mp3' },
    'btn-system-nokernel': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-nokernel', statusText: 'System Status: No Kernel Found', iconCode: 'error_outline', descriptionText: 'System kernel not found, unable to boot.', sound: 'notfound.mp3' },
    'btn-system-nobootloader': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-nobootloader', statusText: 'System Status: No Bootloader Found', iconCode: 'error_outline', descriptionText: 'Bootloader not found.', sound: 'notfound.mp3' },
    'btn-system-unlocked': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-unlocked', statusText: 'System Status: Unlocked', iconCode: 'lock_open', descriptionText: 'System access is unrestricted.', sound: 'unlocked.mp3' },
    'btn-system-severeinfection': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-severeinfection', statusText: 'System Status: Severe Infection', iconCode: 'warning', descriptionText: 'Severe malware or virus detected.', sound: 'severeinfection.mp3' },
    'btn-system-unknown': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-unknown', statusText: 'System Status: Unknown', iconCode: 'quiz', descriptionText: 'System status is currently unknown.', sound: 'notfound.mp3' },
    'btn-system-booting': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-booting', statusText: 'System Status: Booting', iconCode: 'cached', descriptionText: 'System is booting up.', sound: 'booting.mp3' },
    'btn-system-updating': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-updating', statusText: 'System Status: Updating', iconCode: 'system_update_alt', descriptionText: 'System is updating software.', sound: 'maintenance.mp3' },
    'btn-system-optimizing': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-optimizing', statusText: 'Optimizing Apps...', iconCode: 'tune', descriptionText: 'System is optimizing applications.', sound: 'scanning.mp3' },
    'btn-system-ultrascanning': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-ultrascanning', statusText: 'System Status: Ultra Deep Scan', iconCode: 'published_with_changes', descriptionText: 'Performing an ultra deep scan for issues.', sound: 'scanning.mp3' },
    'btn-system-noos': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-noos', statusText: 'System Status: No OS Found', iconCode: 'error_outline', descriptionText: 'No operating system found.', sound: 'notfound.mp3' },
    'btn-system-unlockedcannotscan': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-unlockedcannotscan', statusText: 'System Status: Unlocked - Cannot Scan', iconCode: 'lock_open', descriptionText: 'System is unlocked but cannot be scanned.', sound: 'warning.mp3' },
    'btn-system-normalscan': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-normalscan', statusText: 'System Status: Normal Scan', iconCode: 'search', descriptionText: 'Performing a normal scan for issues.', sound: 'scanning.mp3' },
    'btn-system-malfunction': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-malfunction', statusText: 'System Status: Malfunction', iconCode: 'report_problem', descriptionText: 'System is malfunctioning.', sound: 'error.mp3' },
    'btn-system-updatefail': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-updatefail', statusText: 'System Status: Update Fail', iconCode: 'system_update_warning', descriptionText: 'System update failed.', sound: 'error.mp3' },
    'btn-system-uncompatible': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-uncompatible', statusText: 'System Status: Uncompatible with Services', iconCode: 'portable_wifi_off', descriptionText: 'System is not compatible with services.', sound: 'warning.mp3' },
    'btn-system-wifierror': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-wifierror', statusText: 'System Status: Wifi Error', iconCode: 'wifi_off', descriptionText: 'Wifi error occurred.', sound: 'error.mp3' },
    'btn-system-reportingtoservers': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-reportingtoservers', statusText: 'System Status: Reporting To Servers', iconCode: 'cloud_upload', descriptionText: 'System is reporting to servers.', sound: 'scanning.mp3' },
    'btn-system-wifierror-reporting': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-wifierror-reporting', statusText: 'System Status: Wifi Error, Reporting To Servers', iconCode: 'error_outline', descriptionText: 'Wifi error occurred and reporting to servers.', sound: 'error.mp3' },
    'btn-system-updatefail-reporting': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-updatefail-reporting', statusText: 'System Status: Update Fail, Reporting To Servers', iconCode: 'error_outline', descriptionText: 'System update failed and reporting to servers.', sound: 'error.mp3' },
    'btn-system-shuttingdown': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-shuttingdown', statusText: 'System Status: Shutting Down', iconCode: 'power_settings_new', descriptionText: 'System is shutting down.', sound: 'shutdown.mp3' },
    'btn-system-appsfailedoptimize': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-appsfailedoptimize', statusText: 'System Status: Apps Failed to Optimize', iconCode: 'warning', descriptionText: 'Apps failed to optimize.', sound: 'warning.mp3' },
    'btn-system-checkerlocked': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-checkerlocked', statusText: 'System Status: Checker Locked', iconCode: 'lock', descriptionText: 'System checker is locked.', sound: 'statuslocked.mp3' },
    'btn-system-appsfailedoptimize-reporting': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-appsfailedoptimize-reporting', statusText: 'System Status: Apps Failed to Optimize, Reporting To Servers', iconCode: 'error_outline', descriptionText: 'Apps failed to optimize and reporting to servers.', sound: 'error.mp3' },
    'btn-system-idle': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-idle', statusText: 'System Status: Idle', iconCode: 'sentiment_satisfied', descriptionText: 'System is operating normally but currently idle.', sound: 'standby.mp3' },
    'btn-system-appswifioptimized': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-appswifioptimized', statusText: 'System Status: Apps Optimized for Wifi', iconCode: 'network_check', descriptionText: 'Applications have been optimized for Wi-Fi performance.', sound: 'ok.mp3' },
    
    // New System Statuses
    'btn-system-overheating': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-overheating', statusText: 'System Status: Overheating', iconCode: 'thermostat', descriptionText: 'System temperature is critically high.', sound: 'error.mp3' }, // Use error sound for critical issue
    'btn-system-overcooling': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-overcooling', statusText: 'System Status: Overcooling', iconCode: 'thermostat', descriptionText: 'System temperature is critically low.', sound: 'warning.mp3' }, // Use warning sound
    'btn-system-sleep': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-sleep', statusText: 'System Status: Sleep', iconCode: 'bedtime', descriptionText: 'System is in a low-power sleep state.', sound: 'standby.mp3' }, // Use standby sound
    'btn-system-hibernation': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-hibernation', statusText: 'System Status: Hibernation', iconCode: 'core_mode', descriptionText: 'System is in a deep power-saving hibernation state.', sound: 'shutdown.mp3' }, // Use shutdown sound as it's close to off
    'btn-system-downloading': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-downloading', statusText: 'System Status: Downloading...', iconCode: 'downloading', descriptionText: 'A file is currently being downloaded.', sound: 'scanning.mp3' }, // Use scanning/processing sound
    'btn-system-downloadfinished': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-downloadfinished', statusText: 'System Status: Download Finished', iconCode: 'download_done', descriptionText: 'Download completed successfully.', sound: 'ok.mp3' }, // Use ok sound
    'btn-system-missingdownload': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-missingdownload', statusText: 'System Status: Missing Download', iconCode: 'cloud_off', descriptionText: 'A requested download could not be located.', sound: 'notfound.mp3' }, // Use notfound sound
    'btn-system-downloaderror': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-downloaderror', statusText: 'System Status: Download Error', iconCode: 'error', descriptionText: 'An error occurred during the download.', sound: 'error.mp3' }, // Use error sound
    'btn-system-broken-computer': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-broken-computer', statusText: 'System Status: Broken Computer', iconCode: 'computer_off', descriptionText: 'Computer hardware is physically damaged or broken.', sound: 'error.mp3' },
    'btn-system-no-memory': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-no-memory', statusText: 'System Status: No Memory', iconCode: 'memory', descriptionText: 'System memory not detected or failed.', sound: 'error.mp3' },
    'btn-system-no-ram': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-no-ram', statusText: 'System Status: No RAM', iconCode: 'memory_off', descriptionText: 'RAM modules not detected or failed.', sound: 'error.mp3' },
    'btn-system-no-space': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-no-space', statusText: 'System Status: No Space Left', iconCode: 'storage', descriptionText: 'Storage is completely full, no free space available.', sound: 'error.mp3' },
    'btn-system-plainrock-smashing': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-plainrock-smashing', statusText: 'System Status: Plainrock124 Smashing Computer', iconCode: 'hardware', descriptionText: 'Computer is being physically destroyed by Plainrock124.', sound: 'plainrock124.mp3' },
    
    // New MEMZ infection statuses for various components
    'btn-camera-memz': { display: cameraStatusDisplay, textElement: cameraStatusText, iconElement: cameraStatusIcon, descriptionElement: cameraStatusDescription, statusClass: 'status-memz', statusText: 'Camera Status: Infected by MEMZ', iconCode: 'meme', descriptionText: 'Camera has been infected by the MEMZ virus. Images may be corrupted.', sound: 'audio [music].mp3' },
    'btn-camera-memz-nyancat': { display: cameraStatusDisplay, textElement: cameraStatusText, iconElement: cameraStatusIcon, descriptionElement: cameraStatusDescription, statusClass: 'status-memz-nyancat', statusText: 'Camera Status: Showing Nyan Cat', iconCode: 'meme', descriptionText: 'Camera is displaying Nyan Cat due to MEMZ infection. Camera unusable.', sound: 'audio [music].mp3' },

    'btn-phone-memz': { display: phoneStatusDisplay, textElement: phoneStatusText, iconElement: phoneStatusIcon, descriptionElement: phoneStatusDescription, statusClass: 'status-memz', statusText: 'Phone Status: Infected by MEMZ', iconCode: 'meme', descriptionText: 'Phone has been infected by the MEMZ virus. System unstable.', sound: 'audio [music].mp3' },
    'btn-phone-memz-nyancat': { display: phoneStatusDisplay, textElement: phoneStatusText, iconElement: phoneStatusIcon, descriptionElement: phoneStatusDescription, statusClass: 'status-memz-nyancat', statusText: 'Phone Status: Showing Nyan Cat', iconCode: 'meme', descriptionText: 'Phone is displaying Nyan Cat due to MEMZ infection. Phone unusable.', sound: 'audio [music].mp3' },

    'btn-microphone-memz': { display: microphoneStatusDisplay, textElement: microphoneStatusText, iconElement: microphoneStatusIcon, descriptionElement: microphoneStatusDescription, statusClass: 'status-memz', statusText: 'Microphone Status: Infected by MEMZ', iconCode: 'meme', descriptionText: 'Microphone has been infected by MEMZ. Audio may contain unwanted sounds.', sound: 'audio [music].mp3' },

    'btn-internet-memz': { display: internetStatusDisplay, textElement: internetStatusText, iconElement: internetStatusIcon, descriptionElement: internetStatusDescription, statusClass: 'status-memz', statusText: 'Internet Status: Infected by MEMZ', iconCode: 'meme', descriptionText: 'Internet connection has been infected by MEMZ. Browsing compromised.', sound: 'audio [music].mp3' },

    'btn-wifi-memz': { display: wifiStatusDisplay, textElement: wifiStatusText, iconElement: wifiStatusIcon, descriptionElement: wifiStatusDescription, statusClass: 'status-memz', statusText: 'Wifi Status: Infected by MEMZ', iconCode: 'meme', descriptionText: 'WiFi has been infected by the MEMZ virus. Connection unstable.', sound: 'audio [music].mp3' },
    'btn-wifi-memz-spreading': { display: wifiStatusDisplay, textElement: wifiStatusText, iconElement: wifiStatusIcon, descriptionElement: wifiStatusDescription, statusClass: 'status-memz-spreading', statusText: 'Wifi Status: Spreading MEMZ', iconCode: 'meme', descriptionText: 'WiFi is actively spreading MEMZ virus to all connected devices. CRITICAL THREAT.', sound: 'audio [music].mp3' },
    'btn-wifi-removing-memz': { display: wifiStatusDisplay, textElement: wifiStatusText, iconElement: wifiStatusIcon, descriptionElement: wifiStatusDescription, statusClass: 'status-wifi-removing-memz', statusText: 'WiFi Status: Removing MEMZ', iconCode: 'cleaning_services', descriptionText: 'WiFi system is removing MEMZ virus from connected devices.', sound: 'scanning.mp3' },

    // New System Status: Input/Output, Updates
    'btn-system-keyboard-unplugged': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-keyboard-unplugged', statusText: 'System Status: Keyboard Unplugged', iconCode: 'keyboard_off', descriptionText: 'The keyboard device is not detected.', sound: 'notfound.mp3' },
    'btn-system-mouse-unplugged': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-mouse-unplugged', statusText: 'System Status: Mouse Unplugged', iconCode: 'mouse_off', descriptionText: 'The mouse device is not detected.', sound: 'notfound.mp3' },
    'btn-system-kbmouse-unplugged': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-kbmouse-unplugged', statusText: 'System Status: Mouse and Keyboard Unplugged', iconCode: 'devices_off', descriptionText: 'Input devices (mouse and keyboard) are not detected.', sound: 'notfound.mp3' },
    'btn-system-no-output': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-no-output', statusText: 'System Status: No Output Device', iconCode: 'output', descriptionText: 'No display or primary output device detected.', sound: 'error.mp3' },
    'btn-system-no-input': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-no-input', statusText: 'System Status: No Input Device', iconCode: 'input', descriptionText: 'No primary input device detected.', sound: 'error.mp3' },
    'btn-system-glitchy-output': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-glitchy-output', statusText: 'System Status: Glitchy Output', iconCode: 'signal_cellular_alt_1_bar', descriptionText: 'Output signal is unstable or glitchy.', sound: 'warning.mp3' },
    'btn-system-glitchy-input': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-glitchy-input', statusText: 'System Status: Glitchy Input', iconCode: 'signal_cellular_alt_1_bar', descriptionText: 'Input signal is unstable or glitchy.', sound: 'warning.mp3' },
    'btn-system-outdated': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-outdated', statusText: 'System Status: Outdated', iconCode: 'update', descriptionText: 'System software is outdated.', sound: 'warning.mp3' },
    'btn-system-uptodate': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-uptodate', statusText: 'System Status: Up to Date', iconCode: 'check_circle', descriptionText: 'System software is up to date.', sound: 'ok.mp3' },
    'btn-system-upgrading': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-upgrading', statusText: 'System Status: Upgrading', iconCode: 'system_update_alt', descriptionText: 'System software is upgrading.', sound: 'maintenance.mp3' },
    'btn-system-upgrade-completed': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-upgrade-completed', statusText: 'System Status: Upgrade Completed', iconCode: 'update_done', descriptionText: 'System software upgrade completed successfully.', sound: 'ok.mp3' },
    'btn-system-upgrade-failed': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-upgrade-failed', statusText: 'System Status: Upgrade Failed', iconCode: 'system_update_warning', descriptionText: 'System software upgrade failed.', sound: 'error.mp3' },
    'btn-system-downgrading': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-downgrading', statusText: 'System Status: Downgrading', iconCode: 'history', descriptionText: 'System software is reverting to a previous version.', sound: 'maintenance.mp3' },
    'btn-system-downgrade-completed': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-downgrade-completed', statusText: 'System Status: Downgrade Completed', iconCode: 'history', descriptionText: 'System software downgrade completed successfully.', sound: 'ok.mp3' },
    'btn-system-downgrade-failed': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-downgrade-failed', statusText: 'System Status: Downgrade Failed', iconCode: 'history_toggle_off', descriptionText: 'System software downgrade failed.', sound: 'error.mp3' },


        // New system statuses: No CPU, Empty Disk, installing/uninstalling app states
    'btn-system-no-cpu': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-no-cpu', statusText: 'System Status: No CPU', iconCode: 'memory', descriptionText: 'No CPU detected. System cannot run.', sound: 'error.mp3' },
    'btn-system-empty-disk': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-empty-disk', statusText: 'System Status: Empty Disk', iconCode: 'folder_open', descriptionText: 'No disk or empty disk detected.', sound: 'notfound.mp3' },
    'btn-system-installingapp': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-installing-app', statusText: 'System Status: Installing App', iconCode: 'system_update', descriptionText: 'An application is being installed.', sound: 'scanning.mp3' },
    'btn-system-install-app-failed': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-install-app-failed', statusText: 'System Status: Install App Failed', iconCode: 'error_outline', descriptionText: 'Application installation failed.', sound: 'error.mp3' },
    'btn-system-install-app-finished': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-install-app-finished', statusText: 'System Status: Install App Finished', iconCode: 'done', descriptionText: 'Application installation finished successfully.', sound: 'ok.mp3' },
    'btn-system-uninstallingapp': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-uninstalling-app', statusText: 'System Status: Uninstalling App', iconCode: 'remove_circle', descriptionText: 'An application is being uninstalled.', sound: 'scanning.mp3' },
    'btn-system-uninstall-app-failed': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-uninstall-app-failed', statusText: 'System Status: Uninstall App Failed', iconCode: 'error_outline', descriptionText: 'Application uninstallation failed.', sound: 'error.mp3' },
    'btn-system-uninstall-app-finished': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-uninstall-app-finished', statusText: 'System Status: Uninstall App Finished', iconCode: 'task_alt', descriptionText: 'Application uninstalled successfully.', sound: 'ok.mp3' },

// Wifi Statuses
    'btn-wifi-on-data': { display: wifiStatusDisplay, textElement: wifiStatusText, iconElement: wifiStatusIcon, descriptionElement: wifiStatusDescription, statusClass: 'status-wifi-data', statusText: 'Wifi: On (Data)', iconCode: 'signal_cellular_alt', descriptionText: 'WiFi operating over data mode.', sound: 'ok.mp3' },
    'btn-wifi-on-5g': { display: wifiStatusDisplay, textElement: wifiStatusText, iconElement: wifiStatusIcon, descriptionElement: wifiStatusDescription, statusClass: 'status-wifi-5g', statusText: 'Wifi: On 5G', iconCode: 'signal_cellular_4_bar', descriptionText: 'WiFi using 5G mode.', sound: 'ok.mp3' },
    'btn-wifi-on-4g': { display: wifiStatusDisplay, textElement: wifiStatusText, iconElement: wifiStatusIcon, descriptionElement: wifiStatusDescription, statusClass: 'status-wifi-4g', statusText: 'Wifi: On 4G', iconCode: 'signal_cellular_3_bar', descriptionText: 'WiFi using 4G mode.', sound: 'ok.mp3' },
    'btn-wifi-on-3g': { display: wifiStatusDisplay, textElement: wifiStatusText, iconElement: wifiStatusIcon, descriptionElement: wifiStatusDescription, statusClass: 'status-wifi-3g', statusText: 'Wifi: On 3G', iconCode: 'signal_cellular_2_bar', descriptionText: 'WiFi using 3G mode.', sound: 'warning.mp3' },
    'btn-wifi-on-2g': { display: wifiStatusDisplay, textElement: wifiStatusText, iconElement: wifiStatusIcon, descriptionElement: wifiStatusDescription, statusClass: 'status-wifi-2g', statusText: 'Wifi: On 2G', iconCode: 'signal_cellular_1_bar', descriptionText: 'WiFi using 2G mode.', sound: 'warning.mp3' },
    'btn-wifi-on-1g': { display: wifiStatusDisplay, textElement: wifiStatusText, iconElement: wifiStatusIcon, descriptionElement: wifiStatusDescription, statusClass: 'status-wifi-1g', statusText: 'Wifi: On 1G', iconCode: 'signal_cellular_0_bar', descriptionText: 'WiFi using 1G mode (very slow).', sound: 'warning.mp3' },
    'btn-wifi-on-edge': { display: wifiStatusDisplay, textElement: wifiStatusText, iconElement: wifiStatusIcon, descriptionElement: wifiStatusDescription, statusClass: 'status-wifi-edge', statusText: 'Wifi: On Edge', iconCode: 'network_check', descriptionText: 'WiFi operating on EDGE.', sound: 'warning.mp3' },
    'btn-wifi-full': { display: wifiStatusDisplay, textElement: wifiStatusText, iconElement: wifiStatusIcon, descriptionElement: wifiStatusDescription, statusClass: 'status-wifi-full', statusText: 'Wifi Level: Full', iconCode: 'wifi', descriptionText: 'Wi-Fi signal is full strength.', sound: 'ok.mp3' },
    'btn-wifi-high': { display: wifiStatusDisplay, textElement: wifiStatusText, iconElement: wifiStatusIcon, descriptionElement: wifiStatusDescription, statusClass: 'status-wifi-high', statusText: 'Wifi Level: High (75%)', iconCode: 'wifi', descriptionText: 'Wi-Fi signal is strong.', sound: 'ok.mp3' },
    'btn-wifi-medium': { display: wifiStatusDisplay, textElement: wifiStatusText, iconElement: wifiStatusIcon, descriptionElement: wifiStatusDescription, statusClass: 'status-wifi-medium', statusText: 'Wifi Level: Medium (50%)', iconCode: 'wifi_2_bar', descriptionText: 'Wi-Fi signal is moderate.', sound: 'warning.mp3' },
    'btn-wifi-low': { display: wifiStatusDisplay, textElement: wifiStatusText, iconElement: wifiStatusIcon, descriptionElement: wifiStatusDescription, statusClass: 'status-wifi-low', statusText: 'Wifi Level: Low (25%)', iconCode: 'wifi_1_bar', descriptionText: 'Wi-Fi signal is weak.', sound: 'warning.mp3' },
    'btn-wifi-none': { display: wifiStatusDisplay, textElement: wifiStatusText, iconElement: wifiStatusIcon, descriptionElement: wifiStatusDescription, statusClass: 'status-wifi-none', statusText: 'Wifi Level: None (0%)', iconCode: 'wifi_off', descriptionText: 'No Wi-Fi signal detected.', sound: 'offline.mp3' },
    'btn-wifi-connected': { display: wifiStatusDisplay, textElement: wifiStatusText, iconElement: wifiStatusIcon, descriptionElement: wifiStatusDescription, statusClass: 'status-wifi-connected', statusText: 'Wifi: Connected', iconCode: 'wifi', descriptionText: 'System is connected to a Wi-Fi network.', sound: 'ok.mp3' },
    'btn-wifi-disconnected': { display: wifiStatusDisplay, textElement: wifiStatusText, iconElement: wifiStatusIcon, descriptionElement: wifiStatusDescription, statusClass: 'status-wifi-disconnected', statusText: 'Wifi: Disconnected', iconCode: 'wifi_off', descriptionText: 'System is not connected to a Wi-Fi network.', sound: 'offline.mp3' },
    'btn-wifi-connecting': { display: wifiStatusDisplay, textElement: wifiStatusText, iconElement: wifiStatusIcon, descriptionElement: wifiStatusDescription, statusClass: 'status-wifi-connecting', statusText: 'Wifi: Connecting...', iconCode: 'sync', descriptionText: 'Attempting to connect to a Wi-Fi network.', sound: 'scanning.mp3' },
    'btn-wifi-error': { display: wifiStatusDisplay, textElement: wifiStatusText, iconElement: wifiStatusIcon, descriptionElement: wifiStatusDescription, statusClass: 'status-wifi-error', statusText: 'Wifi: Error', iconCode: 'wifi_off', descriptionText: 'An error occurred with the Wi-Fi connection.', sound: 'error.mp3' },
    'btn-wifi-unknown': { display: wifiStatusDisplay, textElement: wifiStatusText, iconElement: wifiStatusIcon, descriptionElement: wifiStatusDescription, statusClass: 'initial', statusText: 'Wifi: Unknown', iconCode: 'signal_wifi_off', descriptionText: 'Wi-Fi status could not be determined.', sound: 'notfound.mp3' },
    'btn-wifi-idle': { display: wifiStatusDisplay, textElement: wifiStatusText, iconElement: wifiStatusIcon, descriptionElement: wifiStatusDescription, statusClass: 'status-wifi-idle', statusText: 'Wifi: Idle', iconCode: 'wifi', descriptionText: 'Wi-Fi is enabled but not actively connected.', sound: 'standby.mp3' },

    // Battery Statuses
    'btn-battery-full': { display: batteryStatusDisplay, textElement: batteryStatusText, iconElement: batteryStatusIcon, descriptionElement: batteryStatusDescription, statusClass: 'status-battery-full', statusText: 'Battery: Full (100%)', iconCode: 'battery_full', descriptionText: 'Battery is at 100%.', sound: 'ok.mp3' },
    'btn-battery-high': { display: batteryStatusDisplay, textElement: batteryStatusText, iconElement: batteryStatusIcon, descriptionElement: batteryStatusDescription, statusClass: 'status-battery-high', statusText: 'Battery: High (75%)', iconCode: 'battery_4_bar', descriptionText: 'Battery is at approximately 75%.', sound: 'ok.mp3' },
    'btn-battery-medium': { display: batteryStatusDisplay, textElement: batteryStatusText, iconElement: batteryStatusIcon, descriptionElement: batteryStatusDescription, statusClass: 'status-battery-medium', statusText: 'Battery: Medium (50%)', iconCode: 'battery_2_bar', descriptionText: 'Battery is at approximately 50%.', sound: 'warning.mp3' },
    'btn-battery-low': { display: batteryStatusDisplay, textElement: batteryStatusText, iconElement: batteryStatusIcon, descriptionElement: batteryStatusDescription, statusClass: 'status-battery-low', statusText: 'Battery: Low (25%)', iconCode: 'battery_1_bar', descriptionText: 'Battery is at approximately 25%.', sound: 'warning.mp3' },
    'btn-battery-critical': { display: batteryStatusDisplay, textElement: batteryStatusText, iconElement: batteryStatusIcon, descriptionElement: batteryStatusDescription, statusClass: 'status-battery-critical', statusText: 'Battery: Critical (5%)', iconCode: 'battery_alert', descriptionText: 'Battery is at a critically low level (5%).', sound: 'error.mp3' },
    'btn-battery-charging': { display: batteryStatusDisplay, textElement: batteryStatusText, iconElement: batteryStatusIcon, descriptionElement: batteryStatusDescription, statusClass: 'status-battery-charging', statusText: 'Battery: Charging', iconCode: 'battery_charging_full', descriptionText: 'Battery is currently charging.', sound: 'charging.mp3' },
    'btn-battery-charged': { display: batteryStatusDisplay, textElement: batteryStatusText, iconElement: batteryStatusIcon, descriptionElement: batteryStatusDescription, statusClass: 'status-battery-charged', statusText: 'Battery: Charged', iconCode: 'battery_full', descriptionText: 'Battery is fully charged.', sound: 'ok.mp3' },
    'btn-battery-discharging': { display: batteryStatusDisplay, textElement: batteryStatusText, iconElement: batteryStatusIcon, descriptionElement: batteryStatusDescription, statusClass: 'status-battery-discharging', statusText: 'Battery: Discharging', iconCode: 'battery_std', descriptionText: 'Battery is currently discharging.', sound: 'discharging.mp3' },
    'btn-battery-error': { display: batteryStatusDisplay, textElement: batteryStatusText, iconElement: batteryStatusIcon, descriptionElement: batteryStatusDescription, statusClass: 'status-battery-error', statusText: 'Battery: Error', iconCode: 'battery_unknown', descriptionText: 'An error occurred with the battery.', sound: 'error.mp3' },
    'btn-battery-unknown': { display: batteryStatusDisplay, textElement: batteryStatusText, iconElement: batteryStatusIcon, descriptionElement: batteryStatusDescription, statusClass: 'initial', statusText: 'Battery: Unknown', iconCode: 'battery_unknown', descriptionText: 'Battery status could not be determined.', sound: 'notfound.mp3' },
    'btn-battery-protection-on': { display: batteryStatusDisplay, textElement: batteryStatusText, iconElement: batteryStatusIcon, descriptionElement: batteryStatusDescription, statusClass: 'status-battery-protection-on', statusText: 'Battery Protection: On', iconCode: 'health_and_safety', descriptionText: 'Battery protection feature is active.', sound: 'ok.mp3' },
    'btn-battery-idle': { display: batteryStatusDisplay, textElement: batteryStatusText, iconElement: batteryStatusIcon, descriptionElement: batteryStatusDescription, statusClass: 'status-battery-idle', statusText: 'Battery: Idle', iconCode: 'battery_std', descriptionText: 'Battery is present but not actively charging or discharging.', sound: 'standby.mp3' },
    // New Battery Statuses
    'btn-battery-replace': { display: batteryStatusDisplay, textElement: batteryStatusText, iconElement: batteryStatusIcon, descriptionElement: batteryStatusDescription, statusClass: 'status-replace-battery', statusText: 'Battery: Replace Battery', iconCode: 'battery_unknown', descriptionText: 'Battery is failing and needs replacement.', sound: 'error.mp3' },
    'btn-battery-cannotcharge': { display: batteryStatusDisplay, textElement: batteryStatusText, iconElement: batteryStatusIcon, descriptionElement: batteryStatusDescription, statusClass: 'status-battery-cannot-charge', statusText: 'Battery: Cannot Charge', iconCode: 'battery_alert', descriptionText: 'Battery is connected but unable to charge.', sound: 'error.mp3' },
    'btn-battery-dead': { display: batteryStatusDisplay, textElement: batteryStatusText, iconElement: batteryStatusIcon, descriptionElement: batteryStatusDescription, statusClass: 'status-battery-dead', statusText: 'Battery: Dead (0%)', iconCode: 'battery_0_bar', descriptionText: 'Battery is completely depleted and needs immediate charging.', sound: 'error.mp3' },
    'btn-battery-exploding': { display: batteryStatusDisplay, textElement: batteryStatusText, iconElement: batteryStatusIcon, descriptionElement: batteryStatusDescription, statusClass: 'status-battery-exploding', statusText: 'Battery: Exploding', iconCode: 'warning', descriptionText: 'Battery is critically failing and may explode — evacuate or disconnect power immediately.', sound: 'plainrock124.mp3' },

    // Extreme / Fun Battery Statuses
    'btn-battery-overfull': { display: batteryStatusDisplay, textElement: batteryStatusText, iconElement: batteryStatusIcon, descriptionElement: batteryStatusDescription, statusClass: 'status-battery-overfull', statusText: 'Battery: Over-Full (101%)', iconCode: 'battery_unknown', descriptionText: 'Battery reading exceeding expected maximum (101%).', sound: 'warning.mp3' },
    'btn-battery-superfull': { display: batteryStatusDisplay, textElement: batteryStatusText, iconElement: batteryStatusIcon, descriptionElement: batteryStatusDescription, statusClass: 'status-battery-superfull', statusText: 'Battery: Super-Full (200%)', iconCode: 'battery_unknown', descriptionText: 'Battery level massively above normal (200%).', sound: 'warning.mp3' },
    'btn-battery-ultrafull': { display: batteryStatusDisplay, textElement: batteryStatusText, iconElement: batteryStatusIcon, descriptionElement: batteryStatusDescription, statusClass: 'status-battery-ultrafull', statusText: 'Battery: Ultra-Full (1000%)', iconCode: 'battery_unknown', descriptionText: 'Battery level at extreme value (1000%).', sound: 'warning.mp3' },
    'btn-battery-megafull': { display: batteryStatusDisplay, textElement: batteryStatusText, iconElement: batteryStatusIcon, descriptionElement: batteryStatusDescription, statusClass: 'status-battery-megafull', statusText: 'Battery: Mega-Full (1000000000000000000005%)', iconCode: 'battery_unknown', descriptionText: 'Ridiculously large battery percentage detected.', sound: 'warning.mp3' },
    'btn-battery-infinitefull': { display: batteryStatusDisplay, textElement: batteryStatusText, iconElement: batteryStatusIcon, descriptionElement: batteryStatusDescription, statusClass: 'status-battery-infinitefull', statusText: 'Battery: Infinite-Full (infinite%)', iconCode: 'battery_unknown', descriptionText: 'Battery level reported as infinite.', sound: 'unreal.mp3' },

    // Battery being smashed by Plainrock124
    'btn-battery-plainrock-smashing': { display: batteryStatusDisplay, textElement: batteryStatusText, iconElement: batteryStatusIcon, descriptionElement: batteryStatusDescription, statusClass: 'status-plainrock-smashing', statusText: 'Battery Status: Plainrock124 Smashing Battery', iconCode: 'hardware', descriptionText: 'Battery is being physically destroyed by Plainrock124.', sound: 'plainrock124.mp3' },

    // Volume Statuses
    'btn-volume-100': { display: volumeStatusDisplay, textElement: volumeStatusText, iconElement: volumeStatusIcon, descriptionElement: volumeStatusDescription, statusClass: 'status-volume-100', statusText: 'Volume: 100%', iconCode: 'volume_up', descriptionText: 'Volume is set to maximum.', sound: 'ok.mp3' },
    'btn-volume-75': { display: volumeStatusDisplay, textElement: volumeStatusText, iconElement: volumeStatusIcon, descriptionElement: volumeStatusDescription, statusClass: 'status-volume-75', statusText: 'Volume: 75%', iconCode: 'volume_up', descriptionText: 'Volume is set to 75%.', sound: 'ok.mp3' },
    'btn-volume-50': { display: volumeStatusDisplay, textElement: volumeStatusText, iconElement: volumeStatusIcon, descriptionElement: volumeStatusDescription, statusClass: 'status-volume-50', statusText: 'Volume: 50%', iconCode: 'volume_down', descriptionText: 'Volume is set to 50%.', sound: 'warning.mp3' },
    'btn-volume-25': { display: volumeStatusDisplay, textElement: volumeStatusText, iconElement: volumeStatusIcon, descriptionElement: volumeStatusDescription, statusClass: 'status-volume-25', statusText: 'Volume: 25%', iconCode: 'volume_down', descriptionText: 'Volume is set to 25%.', sound: 'warning.mp3' },
    'btn-volume-muted': { display: volumeStatusDisplay, textElement: volumeStatusText, iconElement: volumeStatusIcon, descriptionElement: volumeStatusDescription, statusClass: 'status-volume-muted', statusText: 'Volume: Muted', iconCode: 'volume_mute', descriptionText: 'Volume is muted.', sound: 'offline.mp3' }, // Using offline sound for muted
    'btn-volume-unknown': { display: volumeStatusDisplay, textElement: volumeStatusText, iconElement: volumeStatusIcon, descriptionElement: volumeStatusDescription, statusClass: 'status-volume-unknown', statusText: 'Volume: Unknown (no audio devices)', iconCode: 'volume_off', descriptionText: 'No audio devices detected.', sound: 'notfound.mp3' },
    'btn-volume-above100': { display: volumeStatusDisplay, textElement: volumeStatusText, iconElement: volumeStatusIcon, descriptionElement: volumeStatusDescription, statusClass: 'status-volume-caution', statusText: 'Volume: Above 100% (caution)', iconCode: 'volume_up', descriptionText: 'Volume is digitally boosted, may cause distortion.', sound: 'warning.mp3' },
    'btn-volume-auto': { display: volumeStatusDisplay, textElement: volumeStatusText, iconElement: volumeStatusIcon, descriptionElement: volumeStatusDescription, statusClass: 'status-volume-auto', statusText: 'Volume: Auto % on', iconCode: 'volume_up', descriptionText: 'Automatic volume adjustment is enabled.', sound: 'ok.mp3' },
    'btn-volume-error': { display: volumeStatusDisplay, textElement: volumeStatusText, iconElement: volumeStatusIcon, descriptionElement: volumeStatusDescription, statusClass: 'status-volume-error', statusText: 'Volume: Error', iconCode: 'volume_off', descriptionText: 'An error occurred with audio output.', sound: 'error.mp3' },
    // New Volume Statuses
    'btn-volume-left-only': { display: volumeStatusDisplay, textElement: volumeStatusText, iconElement: volumeStatusIcon, descriptionElement: volumeStatusDescription, statusClass: 'status-volume-left-only', statusText: 'Volume: Left Channel Only', iconCode: 'volume_up', descriptionText: 'Audio is only playing on the left channel.', sound: 'warning.mp3' }, // Warning sound for unusual config
    'btn-volume-right-only': { display: volumeStatusDisplay, textElement: volumeStatusText, iconElement: volumeStatusIcon, descriptionElement: volumeStatusDescription, statusClass: 'status-volume-right-only', statusText: 'Volume: Right Channel Only', iconCode: 'volume_up', descriptionText: 'Audio is only playing on the right channel.', sound: 'warning.mp3' }, // Warning sound for unusual config
    'btn-volume-mono': { display: volumeStatusDisplay, textElement: volumeStatusText, iconElement: volumeStatusIcon, descriptionElement: volumeStatusDescription, statusClass: 'status-volume-mono', statusText: 'Volume: Mono', iconCode: 'volume_up', descriptionText: 'Audio is configured for mono output.', sound: 'ok.mp3' }, // OK sound for standard config
    'btn-volume-stereo': { display: volumeStatusDisplay, textElement: volumeStatusText, iconElement: volumeStatusIcon, descriptionElement: volumeStatusDescription, statusClass: 'status-volume-stereo', statusText: 'Volume: Stereo', iconCode: 'volume_up', descriptionText: 'Audio is configured for stereo output.', sound: 'ok.mp3' }, // OK sound for standard config
    // New Volume Status - Headphones
    'btn-volume-headphones': { display: volumeStatusDisplay, textElement: volumeStatusText, iconElement: volumeStatusIcon, descriptionElement: volumeStatusDescription, statusClass: 'status-volume-headphones', statusText: 'Volume: Headphones', iconCode: 'headset', descriptionText: 'Audio output is directed to headphones.', sound: 'ok.mp3' }, // OK sound for standard output
    'btn-volume-speakers': { display: volumeStatusDisplay, textElement: volumeStatusText, iconElement: volumeStatusIcon, descriptionElement: volumeStatusDescription, statusClass: 'status-volume-speakers', statusText: 'Volume: Speakers', iconCode: 'speaker', descriptionText: 'Audio output is directed to speakers.', sound: 'ok.mp3' }, // OK sound for speakers


    // Internet/Browsing Statuses (New)
    'btn-internet-browsing': { display: internetStatusDisplay, textElement: internetStatusText, iconElement: internetStatusIcon, descriptionElement: internetStatusDescription, statusClass: 'status-internet-browsing', statusText: 'Internet Status: Browsing', iconCode: 'travel_explore', descriptionText: 'Actively browsing the internet.', sound: 'scanning.mp3' },
    'btn-internet-browsing-error': { display: internetStatusDisplay, textElement: internetStatusText, iconElement: internetStatusIcon, descriptionElement: internetStatusDescription, statusClass: 'status-internet-error', statusText: 'Internet Status: Browsing Error', iconCode: 'signal_cellular_connected_no_data', descriptionText: 'An error occurred while browsing.', sound: 'error.mp3' },
    'btn-internet-youtube-watching': { display: internetStatusDisplay, textElement: internetStatusText, iconElement: internetStatusIcon, descriptionElement: internetStatusDescription, statusClass: 'status-youtube-watching', statusText: 'Internet Status: Watching Youtube', iconCode: 'ondemand_video', descriptionText: 'Currently watching a video on Youtube.', sound: 'scanning.mp3' }, // Using scanning for active streaming
    'btn-internet-youtube-error': { display: internetStatusDisplay, textElement: internetStatusText, iconElement: internetStatusIcon, descriptionElement: internetStatusDescription, statusClass: 'status-youtube-error', statusText: 'Internet Status: Youtube Error', iconCode: 'error_outline', descriptionText: 'An error occurred with Youtube playback or connection.', sound: 'error.mp3' },
    'btn-internet-youtube-finished': { display: internetStatusDisplay, textElement: internetStatusText, iconElement: internetStatusIcon, descriptionElement: internetStatusDescription, statusClass: 'status-youtube-finished', statusText: 'Internet Status: Youtube Video Finished', iconCode: 'check_circle', descriptionText: 'The Youtube video has finished playing.', sound: 'ok.mp3' },
    'btn-internet-youtube-unknown': { display: internetStatusDisplay, textElement: internetStatusText, iconElement: internetStatusIcon, descriptionElement: internetStatusDescription, statusClass: 'status-youtube-unknown', statusText: 'Internet Status: Youtube Unknown (Homepage)', iconCode: 'video_stable', descriptionText: 'Currently on the Youtube homepage, video status unknown.', sound: 'standby.mp3' }, // Using standby for idle on homepage
    'btn-internet-watching-plainrock': { display: internetStatusDisplay, textElement: internetStatusText, iconElement: internetStatusIcon, descriptionElement: internetStatusDescription, statusClass: 'status-youtube-watching', statusText: 'Internet Status: Watching Plainrock124', iconCode: 'theaters', descriptionText: 'Watching a stream or content featuring Plainrock124.', sound: 'tv_show.mp3' },

    // New System Status: Watching Pirated Movie
    'btn-system-pirated-movie': { display: systemStatusDisplay, textElement: systemStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-pirated-movie', statusText: 'System Status: Watching Pirated Movie', iconCode: 'warning', descriptionText: 'System detected pirated content playback.', sound: 'ohno.mp3' },

    // New Microphone Statuses
    'btn-microphone-on': { display: microphoneStatusDisplay, textElement: microphoneStatusText, iconElement: microphoneStatusIcon, descriptionElement: microphoneStatusDescription, statusClass: 'status-microphone-on', statusText: 'Microphone: On', iconCode: 'mic', descriptionText: 'Microphone is active and detecting sound.', sound: 'ok.mp3' },
    'btn-microphone-muted': { display: microphoneStatusDisplay, textElement: microphoneStatusText, iconElement: microphoneStatusIcon, descriptionElement: microphoneStatusDescription, statusClass: 'status-microphone-muted', statusText: 'Microphone: Muted', iconCode: 'mic_mute', descriptionText: 'Microphone is muted.', sound: 'standby.mp3' }, // Using standby sound
    'btn-microphone-error': { display: microphoneStatusDisplay, textElement: microphoneStatusText, iconElement: microphoneStatusIcon, descriptionElement: microphoneStatusDescription, statusClass: 'status-microphone-error', statusText: 'Microphone: Error', iconCode: 'mic_off', descriptionText: 'An error occurred with the microphone.', sound: 'error.mp3' },
    'btn-microphone-broken': { display: microphoneStatusDisplay, textElement: microphoneStatusText, iconElement: microphoneStatusIcon, descriptionElement: microphoneStatusDescription, statusClass: 'status-microphone-broken', statusText: 'Microphone: Broken', iconCode: 'report_problem', descriptionText: 'Microphone hardware is broken.', sound: 'error.mp3' },
    'btn-microphone-bad': { display: microphoneStatusDisplay, textElement: microphoneStatusText, iconElement: systemStatusIcon, descriptionElement: systemStatusDescription, statusClass: 'status-microphone-bad', statusText: 'Microphone: Bad Quality', iconCode: 'mic_none', descriptionText: 'Microphone is functioning but audio quality is poor.', sound: 'warning.mp3' }, // Using warning for poor quality
    'btn-microphone-missing': { display: microphoneStatusDisplay, textElement: microphoneStatusText, iconElement: microphoneStatusIcon, descriptionElement: microphoneStatusDescription, statusClass: 'status-microphone-missing', statusText: 'Microphone: Missing', iconCode: 'mic_off', descriptionText: 'No microphone device detected.', sound: 'notfound.mp3' },

    // Microphone being smashed by Plainrock124
    'btn-microphone-plainrock-smashing': { display: microphoneStatusDisplay, textElement: microphoneStatusText, iconElement: microphoneStatusIcon, descriptionElement: microphoneStatusDescription, statusClass: 'status-plainrock-smashing', statusText: 'Microphone Status: Plainrock124 Smashing Microphone', iconCode: 'hardware', descriptionText: 'Microphone is being physically destroyed by Plainrock124.', sound: 'plainrock124.mp3' },

    // New Phone Statuses
    'btn-phone-poweringon': { display: phoneStatusDisplay, textElement: phoneStatusText, iconElement: phoneStatusIcon, descriptionElement: phoneStatusDescription, statusClass: 'status-phone-poweringon', statusText: 'Phone Status: Powering On', iconCode: 'power_settings_new', descriptionText: 'The phone system is starting up.', sound: 'booting.mp3' },
    'btn-phone-shuttingdown': { display: phoneStatusDisplay, textElement: phoneStatusText, iconElement: phoneStatusIcon, descriptionElement: phoneStatusDescription, statusClass: 'status-phone-shuttingdown', statusText: 'Phone Status: Shutting Down', iconCode: 'power_off', descriptionText: 'The phone system is shutting down.', sound: 'shutdown.mp3' },
    'btn-phone-openingapp': { display: phoneStatusDisplay, textElement: phoneStatusText, iconElement: phoneStatusIcon, descriptionElement: phoneStatusDescription, statusClass: 'status-phone-openingapp', statusText: 'Phone Status: Opening App', iconCode: 'apps', descriptionText: 'An application is currently opening.', sound: 'scanning.mp3' },
    'btn-phone-error': { display: phoneStatusDisplay, textElement: phoneStatusText, iconElement: phoneStatusIcon, descriptionElement: phoneStatusDescription, statusClass: 'status-phone-error', statusText: 'Phone Status: Phone Error', iconCode: 'smartphone_error', descriptionText: 'An error has occurred with the phone system.', sound: 'error.mp3' },
    'btn-phone-missingos': { display: phoneStatusDisplay, textElement: phoneStatusText, iconElement: phoneStatusIcon, descriptionElement: phoneStatusDescription, statusClass: 'status-phone-missingos', statusText: 'Phone Status: Missing OS', iconCode: 'smartphone_alert', descriptionText: 'The phone operating system could not be found.', sound: 'notfound.mp3' },
    'btn-phone-deletingapp': { display: phoneStatusDisplay, textElement: phoneStatusText, iconElement: phoneStatusIcon, descriptionElement: phoneStatusDescription, statusClass: 'status-phone-deletingapp', statusText: 'Phone Status: Deleting App', iconCode: 'delete', descriptionText: 'An application is being deleted.', sound: 'scanning.mp3' },
    'btn-phone-apperror': { display: phoneStatusDisplay, textElement: phoneStatusText, iconElement: phoneStatusIcon, descriptionElement: phoneStatusDescription, statusClass: 'status-phone-apperror', statusText: 'Phone Status: App Error', iconCode: 'app_blocking', descriptionText: 'An error occurred within an application.', sound: 'error.mp3' },
    'btn-phone-usingapp': { display: phoneStatusDisplay, textElement: phoneStatusText, iconElement: phoneStatusIcon, descriptionElement: phoneStatusDescription, statusClass: 'status-phone-usingapp', statusText: 'Phone Status: Using App', iconCode: 'apps', descriptionText: 'An application is currently in use.', sound: 'scanning.mp3' }, // Use scanning for active
    'btn-phone-takingphotos': { display: phoneStatusDisplay, textElement: phoneStatusText, iconElement: phoneStatusIcon, descriptionElement: phoneStatusDescription, statusClass: 'status-phone-takingphotos', statusText: 'Phone Status: Taking Photos', iconCode: 'camera', descriptionText: 'The phone camera is actively taking photos.', sound: 'scanning.mp3' },
    // New Phone Status: Adding App
    'btn-phone-addingapp': { display: phoneStatusDisplay, textElement: phoneStatusText, iconElement: phoneStatusIcon, descriptionElement: phoneStatusDescription, statusClass: 'status-phone-addingapp', statusText: 'Phone Status: Adding App', iconCode: 'add_circle', descriptionText: 'Phone is adding an app to your device.', sound: 'scanning.mp3' },
    // New Phone Status for Plainrock124
    'btn-phone-plainrock-smashing': { display: phoneStatusDisplay, textElement: phoneStatusText, iconElement: phoneStatusIcon, descriptionElement: phoneStatusDescription, statusClass: 'status-plainrock-smashing', statusText: 'Phone Status: Plainrock124 Smashing Phone', iconCode: 'smartphone_bad', descriptionText: 'Phone is being physically destroyed by Plainrock124.', sound: 'plainrock124.mp3' },
    // New Phone Idle and Recovery statuses
    'btn-phone-idle': { display: phoneStatusDisplay, textElement: phoneStatusText, iconElement: phoneStatusIcon, descriptionElement: phoneStatusDescription, statusClass: 'status-phone-idle', statusText: 'Phone Status: Idle', iconCode: 'sentiment_satisfied', descriptionText: 'Phone is powered on and idle.', sound: 'standby.mp3' },
    'btn-phone-needs-recovery': { display: phoneStatusDisplay, textElement: phoneStatusText, iconElement: phoneStatusIcon, descriptionElement: phoneStatusDescription, statusClass: 'status-phone-needs-recovery', statusText: 'Phone Status: Needs Recovery', iconCode: 'build_circle', descriptionText: 'Phone requires recovery process to restore functionality.', sound: 'error.mp3' },
    // New Camera Statuses
    'btn-camera-on': { display: cameraStatusDisplay, textElement: cameraStatusText, iconElement: cameraStatusIcon, descriptionElement: cameraStatusDescription, statusClass: 'status-camera-on', statusText: 'Camera Status: On', iconCode: 'camera_alt', descriptionText: 'The camera is active.', sound: 'ok.mp3' },

    // MP3 Player Statuses
    'btn-mp3-poweringon': { display: mp3StatusDisplay, textElement: mp3StatusText, iconElement: mp3StatusIcon, descriptionElement: mp3StatusDescription, statusClass: 'status-mp3-poweringon', statusText: 'MP3 Player: Powering On', iconCode: 'power_settings_new', descriptionText: 'MP3 player is powering on.', sound: 'booting.mp3' },
    'btn-mp3-shuttingdown': { display: mp3StatusDisplay, textElement: mp3StatusText, iconElement: mp3StatusIcon, descriptionElement: mp3StatusDescription, statusClass: 'status-mp3-shuttingdown', statusText: 'MP3 Player: Shutting Down', iconCode: 'power_off', descriptionText: 'MP3 player is shutting down.', sound: 'shutdown.mp3' },
    'btn-mp3-idle': { display: mp3StatusDisplay, textElement: mp3StatusText, iconElement: mp3StatusIcon, descriptionElement: mp3StatusDescription, statusClass: 'status-mp3-idle', statusText: 'MP3 Player: Idle', iconCode: 'sentiment_satisfied', descriptionText: 'MP3 player is idle.', sound: 'standby.mp3' },
    'btn-mp3-playing': { display: mp3StatusDisplay, textElement: mp3StatusText, iconElement: mp3StatusIcon, descriptionElement: mp3StatusDescription, statusClass: 'status-mp3-playing', statusText: 'MP3 Player: Playing Music', iconCode: 'play_arrow', descriptionText: 'MP3 player is playing music.', sound: 'audio [music].mp3' },
    'btn-mp3-music-error': { display: mp3StatusDisplay, textElement: mp3StatusText, iconElement: mp3StatusIcon, descriptionElement: mp3StatusDescription, statusClass: 'status-mp3-music-error', statusText: 'MP3 Player: Music Error', iconCode: 'music_off', descriptionText: 'An error occurred while playing music.', sound: 'error.mp3' },
    'btn-mp3-music-corrupt': { display: mp3StatusDisplay, textElement: mp3StatusText, iconElement: mp3StatusIcon, descriptionElement: mp3StatusDescription, statusClass: 'status-mp3-music-corrupt', statusText: 'MP3 Player: Music Corrupt', iconCode: 'error', descriptionText: 'Music files are corrupted.', sound: 'infected.mp3' },
    'btn-mp3-corrupt': { display: mp3StatusDisplay, textElement: mp3StatusText, iconElement: mp3StatusIcon, descriptionElement: mp3StatusDescription, statusClass: 'status-mp3-corrupt', statusText: 'MP3 Player: Corrupt', iconCode: 'warning', descriptionText: 'MP3 player firmware or storage is corrupt.', sound: 'severeinfection.mp3' },
    'btn-mp3-adding-music': { display: mp3StatusDisplay, textElement: mp3StatusText, iconElement: mp3StatusIcon, descriptionElement: mp3StatusDescription, statusClass: 'status-mp3-adding', statusText: 'MP3 Player: Adding Music', iconCode: 'library_add', descriptionText: 'Adding songs to the MP3 player.', sound: 'scanning.mp3' },
    'btn-mp3-removing-music': { display: mp3StatusDisplay, textElement: mp3StatusText, iconElement: mp3StatusIcon, descriptionElement: mp3StatusDescription, statusClass: 'status-mp3-removing', statusText: 'MP3 Player: Removing Music', iconCode: 'delete', descriptionText: 'Removing songs from the MP3 player.', sound: 'trashthrow.mp3' },
    'btn-mp3-unknown': { display: mp3StatusDisplay, textElement: mp3StatusText, iconElement: mp3StatusIcon, descriptionElement: mp3StatusDescription, statusClass: 'status-mp3-unknown', statusText: 'MP3 Player: Unknown', iconCode: 'help_outline', descriptionText: 'MP3 player status could not be determined.', sound: 'notfound.mp3' },
    'btn-mp3-needs-recovery': { display: mp3StatusDisplay, textElement: mp3StatusText, iconElement: mp3StatusIcon, descriptionElement: mp3StatusDescription, statusClass: 'status-mp3-needs-recovery', statusText: 'MP3 Player: Needs Recovery', iconCode: 'build_circle', descriptionText: 'MP3 player needs recovery or reformat.', sound: 'error.mp3' },
    'btn-mp3-plainrock-smashing': { display: mp3StatusDisplay, textElement: mp3StatusText, iconElement: mp3StatusIcon, descriptionElement: mp3StatusDescription, statusClass: 'status-plainrock-smashing', statusText: 'MP3 Player: Plainrock124 Smashing MP3 Player', iconCode: 'hardware', descriptionText: 'MP3 player is being smashed by Plainrock124.', sound: 'plainrock124.mp3' },
    'btn-mp3-memz': { display: mp3StatusDisplay, textElement: mp3StatusText, iconElement: mp3StatusIcon, descriptionElement: mp3StatusDescription, statusClass: 'status-mp3-memz', statusText: 'MP3 Player: Infected by MEMZ', iconCode: 'meme', descriptionText: 'MP3 player has been infected by the MEMZ virus.', sound: 'audio [music].mp3' },
    'btn-mp3-memz-nyancat': { display: mp3StatusDisplay, textElement: mp3StatusText, iconElement: mp3StatusIcon, descriptionElement: mp3StatusDescription, statusClass: 'status-mp3-memz-nyancat', statusText: 'MP3 Player: Showing Nyan Cat MEMZ', iconCode: 'meme', descriptionText: 'MP3 player is showing Nyan Cat due to MEMZ infection.', sound: 'audio [music].mp3' },
    'btn-camera-flipped': { display: cameraStatusDisplay, textElement: cameraStatusText, iconElement: cameraStatusIcon, descriptionElement: cameraStatusDescription, statusClass: 'status-camera-flipped', statusText: 'Camera Status: On but Flipped', iconCode: 'flip_camera_android', descriptionText: 'The camera is active but the image is flipped.', sound: 'warning.mp3' },
    'btn-camera-off': { display: cameraStatusDisplay, textElement: cameraStatusText, iconElement: cameraStatusIcon, descriptionElement: cameraStatusDescription, statusClass: 'status-camera-off', statusText: 'Camera Status: Off', iconCode: 'camera_alt_off', descriptionText: 'The camera is inactive.', sound: 'shutdown.mp3' },
    'btn-camera-glitchy': { display: cameraStatusDisplay, textElement: cameraStatusText, iconElement: cameraStatusIcon, descriptionElement: cameraStatusDescription, statusClass: 'status-camera-glitchy', statusText: 'Camera Status: Glitchy', iconCode: 'broken_image', descriptionText: 'The camera output is unstable or glitchy.', sound: 'warning.mp3' },
    'btn-camera-filter': { display: cameraStatusDisplay, textElement: cameraStatusText, iconElement: cameraStatusIcon, descriptionElement: cameraStatusDescription, statusClass: 'status-camera-filter', statusText: 'Camera Status: With Filter On', iconCode: 'filter_hdr', descriptionText: 'The camera is active with a filter applied.', sound: 'ok.mp3' },
    'btn-camera-flippedfilter': { display: cameraStatusDisplay, textElement: cameraStatusText, iconElement: cameraStatusIcon, descriptionElement: cameraStatusDescription, statusClass: 'status-camera-flippedfilter', statusText: 'Camera Status: Flipped with Filter On', iconCode: 'flip_camera_android', descriptionText: 'The camera is active, flipped, with a filter applied.', sound: 'warning.mp3' },
    'btn-camera-recording': { display: cameraStatusDisplay, textElement: cameraStatusText, iconElement: cameraStatusIcon, descriptionElement: cameraStatusDescription, statusClass: 'status-camera-recording', statusText: 'Camera Status: Recording', iconCode: 'videocam_on', descriptionText: 'The camera is currently recording video.', sound: 'scanning.mp3' },
    'btn-camera-recordingerror': { display: cameraStatusDisplay, textElement: cameraStatusText, iconElement: cameraStatusIcon, descriptionElement: cameraStatusDescription, statusClass: 'status-camera-recordingerror', statusText: 'Camera Status: Recording Error', iconCode: 'videocam_off', descriptionText: 'An error occurred while recording video.', sound: 'error.mp3' },
    'btn-camera-flippedrecording': { display: cameraStatusDisplay, textElement: cameraStatusText, iconElement: cameraStatusIcon, descriptionElement: cameraStatusDescription, statusClass: 'status-camera-flippedrecording', statusText: 'Camera Status: Flipped Recording', iconCode: 'flip_camera_android', descriptionText: 'The camera is recording video but the image is flipped.', sound: 'warning.mp3' },
    'btn-camera-takingphotos': { display: cameraStatusDisplay, textElement: cameraStatusText, iconElement: cameraStatusIcon, descriptionElement: cameraStatusDescription, statusClass: 'status-camera-takingphotos', statusText: 'Camera Status: Taking Photos', iconCode: 'camera', descriptionText: 'The camera is actively taking still photos.', sound: 'scanning.mp3' },
    'btn-camera-photoserror': { display: cameraStatusDisplay, textElement: cameraStatusText, iconElement: cameraStatusIcon, descriptionElement: cameraStatusDescription, statusClass: 'status-camera-photoserror', statusText: 'Camera Status: Photos Error', iconCode: 'camera_alt_off', descriptionText: 'An error occurred while taking photos.', sound: 'error.mp3' },
    'btn-camera-flippedphotos': { display: cameraStatusDisplay, textElement: cameraStatusText, iconElement: cameraStatusIcon, descriptionElement: cameraStatusDescription, statusClass: 'status-camera-flippedphotos', statusText: 'Camera Status: Flipped Taking Photos', iconCode: 'flip_camera_android', descriptionText: 'The camera is taking photos but the image is flipped.', sound: 'warning.mp3' },
    'btn-camera-unknown': { display: cameraStatusDisplay, textElement: cameraStatusText, iconElement: cameraStatusIcon, descriptionElement: cameraStatusDescription, statusClass: 'status-camera-unknown', statusText: 'Camera Status: Unknown', iconCode: 'camera_roll', descriptionText: 'Camera status could not be determined.', sound: 'notfound.mp3' },
    'btn-camera-error': { display: cameraStatusDisplay, textElement: cameraStatusText, iconElement: cameraStatusIcon, descriptionElement: cameraStatusDescription, statusClass: 'status-camera-error', statusText: 'Camera Status: Error', iconCode: 'camera_alt_off', descriptionText: 'An error has occurred with the camera.', sound: 'error.mp3' },
    'btn-camera-missing': { display: cameraStatusDisplay, textElement: cameraStatusText, iconElement: cameraStatusIcon, descriptionElement: cameraStatusDescription, statusClass: 'status-camera-missing', statusText: 'Camera Status: Missing', iconCode: 'no_photography', descriptionText: 'No camera device detected.', sound: 'notfound.mp3' },
    'btn-camera-bad': { display: cameraStatusDisplay, textElement: cameraStatusText, iconElement: cameraStatusIcon, descriptionElement: cameraStatusDescription, statusClass: 'status-camera-bad', statusText: 'Camera Status: Bad Quality', iconCode: 'camera_alt', descriptionText: 'Camera is functioning but image quality is poor.', sound: 'warning.mp3' },
    // Console Statuses
    'btn-console-startup': { display: consoleStatusDisplay, textElement: consoleStatusText, iconElement: consoleStatusIcon, descriptionElement: consoleStatusDescription, statusClass: 'status-console-startup', statusText: 'Console Status: Starting Up', iconCode: 'power_settings_new', descriptionText: 'Console is powering on and initializing.', sound: 'booting.mp3' },
    'btn-console-shutdown': { display: consoleStatusDisplay, textElement: consoleStatusText, iconElement: consoleStatusIcon, descriptionElement: consoleStatusDescription, statusClass: 'status-console-shutdown', statusText: 'Console Status: Shutting Down', iconCode: 'power_off', descriptionText: 'Console is powering off.', sound: 'shutdown.mp3' },
    'btn-console-startgame': { display: consoleStatusDisplay, textElement: consoleStatusText, iconElement: consoleStatusIcon, descriptionElement: consoleStatusDescription, statusClass: 'status-console-startgame', statusText: 'Console Status: Starting Game', iconCode: 'sports_esports', descriptionText: 'Console is loading a game.', sound: 'scanning.mp3' },
    'btn-console-error': { display: consoleStatusDisplay, textElement: consoleStatusText, iconElement: consoleStatusIcon, descriptionElement: consoleStatusDescription, statusClass: 'status-console-error', statusText: 'Console Status: Error', iconCode: 'error', descriptionText: 'Console has encountered an error.', sound: 'error.mp3' },
    'btn-console-playinggame': { display: consoleStatusDisplay, textElement: consoleStatusText, iconElement: consoleStatusIcon, descriptionElement: consoleStatusDescription, statusClass: 'status-console-playinggame', statusText: 'Console Status: Playing Game', iconCode: 'videogame_asset', descriptionText: 'Console is actively running a game.', sound: 'ok.mp3' },
    'btn-console-gameerror': { display: consoleStatusDisplay, textElement: consoleStatusText, iconElement: consoleStatusIcon, descriptionElement: consoleStatusDescription, statusClass: 'status-console-gameerror', statusText: 'Console Status: Game Error', iconCode: 'gamer_error', descriptionText: 'Game has encountered an error while running.', sound: 'error.mp3' },
    'btn-console-disknotread': { display: consoleStatusDisplay, textElement: consoleStatusText, iconElement: consoleStatusIcon, descriptionElement: consoleStatusDescription, statusClass: 'status-console-disknotread', statusText: 'Console Status: Disk Cannot Be Read', iconCode: 'disc_full', descriptionText: 'Console cannot read the inserted game disk.', sound: 'notfound.mp3' },
    'btn-console-idle': { display: consoleStatusDisplay, textElement: consoleStatusText, iconElement: consoleStatusIcon, descriptionElement: consoleStatusDescription, statusClass: 'status-console-idle', statusText: 'Console Status: Idle', iconCode: 'gamepad', descriptionText: 'Console is powered on but not actively running a game.', sound: 'standby.mp3' },
    'btn-console-unknown': { display: consoleStatusDisplay, textElement: consoleStatusText, iconElement: consoleStatusIcon, descriptionElement: consoleStatusDescription, statusClass: 'initial', statusText: 'Console Status: Unknown', iconCode: 'help', descriptionText: 'Console status could not be determined.', sound: 'notfound.mp3' },
    'btn-console-controllermissing': { display: consoleStatusDisplay, textElement: consoleStatusText, iconElement: consoleStatusIcon, descriptionElement: consoleStatusDescription, statusClass: 'status-console-controllermissing', statusText: 'Console Status: Controller Missing', iconCode: 'disabled_by_default', descriptionText: 'No controller is connected to the console.', sound: 'notfound.mp3' },
    'btn-console-memz': { display: consoleStatusDisplay, textElement: consoleStatusText, iconElement: consoleStatusIcon, descriptionElement: consoleStatusDescription, statusClass: 'status-memz', statusText: 'Console Status: Infected by MEMZ', iconCode: 'meme', descriptionText: 'Console has been infected by the MEMZ virus.', sound: 'audio [music].mp3' },
    'btn-console-memz-nyancat': { display: consoleStatusDisplay, textElement: consoleStatusText, iconElement: consoleStatusIcon, descriptionElement: consoleStatusDescription, statusClass: 'status-memz-nyancat', statusText: 'Console Status: Showing MEMZ Nyan Cat', iconCode: 'meme', descriptionText: 'Console is displaying Nyan Cat due to MEMZ infection.', sound: 'audio [music].mp3' },
    'btn-console-plainrock-smashing': { display: consoleStatusDisplay, textElement: consoleStatusText, iconElement: consoleStatusIcon, descriptionElement: consoleStatusDescription, statusClass: 'status-plainrock-smashing', statusText: 'Console Status: Plainrock124 Smashing Console', iconCode: 'hardware', descriptionText: 'Console is being physically destroyed by Plainrock124.', sound: 'plainrock124.mp3' },
    'btn-console-stickdrift': { display: consoleStatusDisplay, textElement: consoleStatusText, iconElement: consoleStatusIcon, descriptionElement: consoleStatusDescription, statusClass: 'status-console-stickdrift', statusText: 'Console Status: Controller Stick Drift', iconCode: 'swipe', descriptionText: 'Controller joysticks are registering movement when not being touched.', sound: 'warning.mp3' },
    // TV Statuses
    'btn-tv-startup': { display: tvStatusDisplay, textElement: tvStatusText, iconElement: tvStatusIcon, descriptionElement: tvStatusDescription, statusClass: 'status-tv-startup', statusText: 'TV Status: Starting Up', iconCode: 'power_settings_new', descriptionText: 'TV is powering on and initializing.', sound: 'booting.mp3' },
    'btn-tv-shutdown': { display: tvStatusDisplay, textElement: tvStatusText, iconElement: tvStatusIcon, descriptionElement: tvStatusDescription, statusClass: 'status-tv-shutdown', statusText: 'TV Status: Shutting Down', iconCode: 'power_off', descriptionText: 'TV is powering off.', sound: 'shutdown.mp3' },
    'btn-tv-error': { display: tvStatusDisplay, textElement: tvStatusText, iconElement: tvStatusIcon, descriptionElement: tvStatusDescription, statusClass: 'status-tv-error', statusText: 'TV Status: Error', iconCode: 'error', descriptionText: 'TV has encountered an error.', sound: 'error.mp3' },
    'btn-tv-watchingnews': { display: tvStatusDisplay, textElement: tvStatusText, iconElement: tvStatusIcon, descriptionElement: tvStatusDescription, statusClass: 'status-tv-watchingnews', statusText: 'TV Status: Watching News', iconCode: 'newspaper', descriptionText: 'TV is displaying a news broadcast.', sound: 'tv_news.mp3' },
    'btn-tv-watchingshow': { display: tvStatusDisplay, textElement: tvStatusText, iconElement: tvStatusIcon, descriptionElement: tvStatusDescription, statusClass: 'status-tv-watchingshow', statusText: 'TV Status: Watching Show', iconCode: 'tv', descriptionText: 'TV is displaying a television show.', sound: 'tv_show.mp3' },
    'btn-tv-watchingmovie': { display: tvStatusDisplay, textElement: tvStatusText, iconElement: tvStatusIcon, descriptionElement: tvStatusDescription, statusClass: 'status-tv-watchingmovie', statusText: 'TV Status: Watching Movie', iconCode: 'movie', descriptionText: 'TV is playing a movie.', sound: 'tv_movie.mp3' },
    'btn-tv-movieerror': { display: tvStatusDisplay, textElement: tvStatusText, iconElement: tvStatusIcon, descriptionElement: tvStatusDescription, statusClass: 'status-tv-movieerror', statusText: 'TV Status: Movie Error', iconCode: 'movie_error', descriptionText: 'Error while playing a movie.', sound: 'error.mp3' },
    'btn-tv-newserror': { display: tvStatusDisplay, textElement: tvStatusText, iconElement: tvStatusIcon, descriptionElement: tvStatusDescription, statusClass: 'status-tv-newserror', statusText: 'TV Status: News Error', iconCode: 'newspaper_error', descriptionText: 'Error while displaying news broadcast.', sound: 'error.mp3' },
    'btn-tv-showerror': { display: tvStatusDisplay, textElement: tvStatusText, iconElement: tvStatusIcon, descriptionElement: tvStatusDescription, statusClass: 'status-tv-showerror', statusText: 'TV Status: Show Error', iconCode: 'tv_off', descriptionText: 'Error while playing a TV show.', sound: 'error.mp3' },
    'btn-tv-showhijacked': { display: tvStatusDisplay, textElement: tvStatusText, iconElement: tvStatusIcon, descriptionElement: tvStatusDescription, statusClass: 'status-tv-showhijacked', statusText: 'TV Status: Show Hijacked', iconCode: 'warning', descriptionText: 'TV show broadcast has been hijacked by an unauthorized source.', sound: 'tvhijacked.mp3' },
    'btn-tv-newshijacked': { display: tvStatusDisplay, textElement: tvStatusText, iconElement: tvStatusIcon, descriptionElement: tvStatusDescription, statusClass: 'status-tv-newshijacked', statusText: 'TV Status: News Hijacked', iconCode: 'warning', descriptionText: 'News broadcast has been hijacked by an unauthorized source.', sound: 'tvhijacked.mp3' },
    'btn-tv-moviehijacked': { display: tvStatusDisplay, textElement: tvStatusText, iconElement: tvStatusIcon, descriptionElement: tvStatusDescription, statusClass: 'status-tv-moviehijacked', statusText: 'TV Status: Movie Hijacked', iconCode: 'warning', descriptionText: 'Movie playback has been hijacked by an unauthorized source.', sound: 'tvhijacked.mp3' },
    'btn-tv-unknown': { display: tvStatusDisplay, textElement: tvStatusText, iconElement: tvStatusIcon, descriptionElement: tvStatusDescription, statusClass: 'initial', statusText: 'TV Status: Unknown', iconCode: 'help', descriptionText: 'TV status could not be determined.', sound: 'notfound.mp3' },
    'btn-tv-missingremote': { display: tvStatusDisplay, textElement: tvStatusText, iconElement: tvStatusIcon, descriptionElement: tvStatusDescription, statusClass: 'status-tv-missingremote', statusText: 'TV Status: Missing Remote', iconCode: 'remote_off', descriptionText: 'TV remote control could not be located.', sound: 'notfound.mp3' },
    'btn-tv-memz': { display: tvStatusDisplay, textElement: tvStatusText, iconElement: tvStatusIcon, descriptionElement: tvStatusDescription, statusClass: 'status-memz', statusText: 'TV Status: Infected by MEMZ', iconCode: 'meme', descriptionText: 'TV has been infected by the MEMZ virus.', sound: 'audio [music].mp3' },
    'btn-tv-memz-nyancat': { display: tvStatusDisplay, textElement: tvStatusText, iconElement: tvStatusIcon, descriptionElement: tvStatusDescription, statusClass: 'status-memz-nyancat', statusText: 'TV Status: Showing MEMZ Nyan Cat', iconCode: 'meme', descriptionText: 'TV is displaying Nyan Cat due to MEMZ infection.', sound: 'audio [music].mp3' },
    'btn-tv-plainrock-smashing': { display: tvStatusDisplay, textElement: tvStatusText, iconElement: tvStatusIcon, descriptionElement: tvStatusDescription, statusClass: 'status-plainrock-smashing', statusText: 'TV Status: Plainrock124 Smashing TV', iconCode: 'hardware', descriptionText: 'TV is being physically destroyed by Plainrock124.', sound: 'plainrock124.mp3' },
    'btn-tv-eas-alarm': { display: tvStatusDisplay, textElement: tvStatusText, iconElement: tvStatusIcon, descriptionElement: tvStatusDescription, statusClass: 'status-tv-eas-alarm', statusText: 'TV Status: Emergency Alert', iconCode: 'warning', descriptionText: 'Emergency Alert System broadcast in progress.', sound: 'eas_alarm.mp3' },
    'btn-phone-eas-alarm': { display: phoneStatusDisplay, textElement: phoneStatusText, iconElement: phoneStatusIcon, descriptionElement: phoneStatusDescription, statusClass: 'status-phone-eas-alarm', statusText: 'Phone Status: Emergency Alert', iconCode: 'warning', descriptionText: 'Emergency Alert notification received.', sound: 'eas_alarm.mp3' },
    // Trash Can Statuses
    'btn-trash-empty': { display: trashStatusDisplay, textElement: trashStatusText, iconElement: trashStatusIcon, descriptionElement: trashStatusDescription, statusClass: 'status-trash-empty', statusText: 'Trash Can Status: Empty', iconCode: 'delete_outline', descriptionText: 'Trash can is empty and ready to use.', sound: 'ok.mp3' },
    'btn-trash-onefile': { display: trashStatusDisplay, textElement: trashStatusText, iconElement: trashStatusIcon, descriptionElement: trashStatusDescription, statusClass: 'status-trash-onefile', statusText: 'Trash Can Status: 1 File', iconCode: 'delete', descriptionText: 'Trash can contains 1 file.', sound: 'trashthrow.mp3' },
    'btn-trash-tenfiles': { display: trashStatusDisplay, textElement: trashStatusText, iconElement: trashStatusIcon, descriptionElement: trashStatusDescription, statusClass: 'status-trash-tenfiles', statusText: 'Trash Can Status: 10 Files', iconCode: 'delete', descriptionText: 'Trash can contains 10 files.', sound: 'trashthrow.mp3' },
    'btn-trash-hundredfiles': { display: trashStatusDisplay, textElement: trashStatusText, iconElement: trashStatusIcon, descriptionElement: trashStatusDescription, statusClass: 'status-trash-hundredfiles', statusText: 'Trash Can Status: 100 Files', iconCode: 'delete', descriptionText: 'Trash can contains 100 files. Consider emptying.', sound: 'trashthrow.mp3' },
    'btn-trash-full': { display: trashStatusDisplay, textElement: trashStatusText, iconElement: trashStatusIcon, descriptionElement: trashStatusDescription, statusClass: 'status-trash-full', statusText: 'Trash Can Status: Full', iconCode: 'delete_forever', descriptionText: 'Trash can is completely full. Please empty.', sound: 'warning.mp3' },
    'btn-trash-emptying': { display: trashStatusDisplay, textElement: trashStatusText, iconElement: trashStatusIcon, descriptionElement: trashStatusDescription, statusClass: 'status-trash-emptying', statusText: 'Trash Can Status: Emptying', iconCode: 'cleaning_services', descriptionText: 'Trash can is being emptied.', sound: 'charging.mp3' },
    'btn-trash-emptying-error': { display: trashStatusDisplay, textElement: trashStatusText, iconElement: trashStatusIcon, descriptionElement: trashStatusDescription, statusClass: 'status-trash-emptying-error', statusText: 'Trash Can Status: Emptying Error', iconCode: 'error', descriptionText: 'An error occurred while emptying the trash.', sound: 'error.mp3' },
    'btn-trash-emptying-finished': { display: trashStatusDisplay, textElement: trashStatusText, iconElement: trashStatusIcon, descriptionElement: trashStatusDescription, statusClass: 'status-trash-emptying-finished', statusText: 'Trash Can Status: Emptying Finished', iconCode: 'task_alt', descriptionText: 'Trash can has been successfully emptied.', sound: 'ok.mp3' },
    'btn-trash-inception': { display: trashStatusDisplay, textElement: trashStatusText, iconElement: trashStatusIcon, descriptionElement: trashStatusDescription, statusClass: 'status-trash-inception', statusText: 'Trash Can Status: Trash Can Inception', iconCode: 'warning', descriptionText: 'CAUTION: Trash can contains another trash can inside it. Recursive deletion risk.', sound: 'warning.mp3' },
    'btn-trash-inception-2': { display: trashStatusDisplay, textElement: trashStatusText, iconElement: trashStatusIcon, descriptionElement: trashStatusDescription, statusClass: 'status-trash-inception-2', statusText: 'Trash Can Status: Double Trash Can Inception', iconCode: 'dangerous', descriptionText: 'CAUTION: Trash can contains a trash can that contains another trash can. High recursion risk.', sound: 'severeinfection.mp3' },
    'btn-trash-infinite': { display: trashStatusDisplay, textElement: trashStatusText, iconElement: trashStatusIcon, descriptionElement: trashStatusDescription, statusClass: 'status-trash-infinite', statusText: 'Trash Can Status: Infinite Inception', iconCode: 'autorenew', descriptionText: 'WARNING: Infinite loops of nested trash cans detected — potential UI/infinite recursion hazard.', sound: 'unreal.mp3' },
    'btn-trash-unknown': { display: trashStatusDisplay, textElement: trashStatusText, iconElement: trashStatusIcon, descriptionElement: trashStatusDescription, statusClass: 'initial', statusText: 'Trash Can Status: Unknown (no trash can)', iconCode: 'help_outline', descriptionText: 'No trash can could be detected or found.', sound: 'notfound.mp3' },

    // HTTP Statuses
    'btn-http-100': { display: httpStatusDisplay, textElement: httpStatusText, iconElement: httpStatusIcon, descriptionElement: httpStatusDescription, statusClass: 'status-http-100', statusText: 'HTTP Status: 100 Continue', iconCode: 'hourglass_empty', descriptionText: 'Client may continue with the request.', sound: 'ok.mp3' },
    'btn-http-124': { display: httpStatusDisplay, textElement: httpStatusText, iconElement: httpStatusIcon, descriptionElement: httpStatusDescription, statusClass: 'status-http-124', statusText: 'HTTP Status: 124 Plainrock', iconCode: 'build_circle', descriptionText: 'Custom/Plainrock status code signifying chaos.', sound: 'plainrock124.mp3' },
    'btn-http-400': { display: httpStatusDisplay, textElement: httpStatusText, iconElement: httpStatusIcon, descriptionElement: httpStatusDescription, statusClass: 'status-http-400', statusText: 'HTTP Status: 400 Bad Request', iconCode: 'report_problem', descriptionText: 'The server could not understand the request due to invalid syntax.', sound: 'error.mp3' },
    'btn-http-403': { display: httpStatusDisplay, textElement: httpStatusText, iconElement: httpStatusIcon, descriptionElement: httpStatusDescription, statusClass: 'status-http-403', statusText: 'HTTP Status: 403 Forbidden', iconCode: 'block', descriptionText: 'Client does not have access rights to the content.', sound: 'locked.mp3' },
    'btn-http-404': { display: httpStatusDisplay, textElement: httpStatusText, iconElement: httpStatusIcon, descriptionElement: httpStatusDescription, statusClass: 'status-http-404', statusText: 'HTTP Status: 404 Not Found', iconCode: 'help_outline', descriptionText: 'The server cannot find the requested resource.', sound: 'notfound.mp3' },
    'btn-http-418': { display: httpStatusDisplay, textElement: httpStatusText, iconElement: httpStatusIcon, descriptionElement: httpStatusDescription, statusClass: 'status-http-418', statusText: "HTTP Status: 418 I'm a teapot", iconCode: 'meme', descriptionText: "Server refuses to brew coffee because it is a teapot.", sound: 'audio [music].mp3' },
    'btn-http-420': { display: httpStatusDisplay, textElement: httpStatusText, iconElement: httpStatusIcon, descriptionElement: httpStatusDescription, statusClass: 'status-http-420', statusText: 'HTTP Status: 420 Error', iconCode: 'meme', descriptionText: 'Enhance Your Calm - generic error condition.', sound: 'audio [music].mp3' },
    'btn-http-429': { display: httpStatusDisplay, textElement: httpStatusText, iconElement: httpStatusIcon, descriptionElement: httpStatusDescription, statusClass: 'status-http-429', statusText: 'HTTP Status: 429 Too Many Requests', iconCode: 'hourglass_disabled', descriptionText: 'User has sent too many requests in a given amount of time.', sound: 'warning.mp3' },
    'btn-http-500': { display: httpStatusDisplay, textElement: httpStatusText, iconElement: httpStatusIcon, descriptionElement: httpStatusDescription, statusClass: 'status-http-500', statusText: 'HTTP Status: 500 Internal Server Error', iconCode: 'report', descriptionText: 'The server has encountered a situation it doesn\'t know how to handle.', sound: 'error.mp3' },
    'btn-http-502': { display: httpStatusDisplay, textElement: httpStatusText, iconElement: httpStatusIcon, descriptionElement: httpStatusDescription, statusClass: 'status-http-502', statusText: 'HTTP Status: 502 Bad Gateway', iconCode: 'cloud_off', descriptionText: 'Invalid response from the upstream server.', sound: 'error.mp3' },
    // Unknown HTTP status
    'btn-http-unknown': { display: httpStatusDisplay, textElement: httpStatusText, iconElement: httpStatusIcon, descriptionElement: httpStatusDescription, statusClass: 'status-http-unknown', statusText: 'HTTP Status: Unknown', iconCode: 'help_outline', descriptionText: 'An unexplained or nonstandard HTTP status was received (???).', sound: 'notfound.mp3' },
};

// Add event listeners to system buttons
systemButtons.forEach(button => {
    button.addEventListener('click', () => {
        const statusData = statusMap[button.id];
        if (statusData) {
            // Call setStatus with correct parameters from the map
            setStatus(statusData.display, statusData.textElement, statusData.iconElement, statusData.descriptionElement, statusData.statusClass, statusData.statusText, statusData.iconCode, statusData.descriptionText, statusData.sound);
        }
    });
});

// Add event listeners to wifi buttons
wifiButtons.forEach(button => {
    button.addEventListener('click', () => {
        const statusData = statusMap[button.id];
        if (statusData) {
            // Call setStatus with correct parameters for wifi
            setStatus(statusData.display, statusData.textElement, statusData.iconElement, statusData.descriptionElement, statusData.statusClass, statusData.statusText, statusData.iconCode, statusData.descriptionText, statusData.sound);
        }
    });
});

// Add event listeners to battery buttons
batteryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const statusData = statusMap[button.id];
        if (statusData) {
            // Call setStatus with correct parameters for battery
            setStatus(statusData.display, statusData.textElement, statusData.iconElement, statusData.descriptionElement, statusData.statusClass, statusData.statusText, statusData.iconCode, statusData.descriptionText, statusData.sound);
        }
    });
});

// Add event listeners to volume buttons
volumeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const statusData = statusMap[button.id];
        if (statusData) {
            // Call setStatus with correct parameters for volume
            setStatus(statusData.display, statusData.textElement, statusData.iconElement, statusData.descriptionElement, statusData.statusClass, statusData.statusText, statusData.iconCode, statusData.descriptionText, statusData.sound);
        }
    });
});

// Add event listeners to internet/browsing buttons (New)
internetButtons.forEach(button => {
    button.addEventListener('click', () => {
        const statusData = statusMap[button.id];
        if (statusData) {
            // Call setStatus with correct parameters for internet/browsing
            setStatus(statusData.display, statusData.textElement, statusData.iconElement, statusData.descriptionElement, statusData.statusClass, statusData.statusText, statusData.iconCode, statusData.descriptionText, statusData.sound);
        }
    });
});

// Add event listeners to microphone buttons (New)
microphoneButtons.forEach(button => {
    button.addEventListener('click', () => {
        const statusData = statusMap[button.id];
        if (statusData) {
            // Call setStatus with correct parameters for microphone
            setStatus(statusData.display, statusData.textElement, statusData.iconElement, statusData.descriptionElement, statusData.statusClass, statusData.statusText, statusData.iconCode, statusData.descriptionText, statusData.sound);
        }
    });
});

 // Add event listeners to phone buttons (New)
 phoneButtons.forEach(button => {
     button.addEventListener('click', () => {
         const statusData = statusMap[button.id];
         if (statusData) {
             // Call setStatus with correct parameters for phone
             setStatus(statusData.display, statusData.textElement, statusData.iconElement, statusData.descriptionElement, statusData.statusClass, statusData.statusText, statusData.iconCode, statusData.descriptionText, statusData.sound);
         }
     });
 });

 // Add event listeners to MP3 Player buttons (New)
 mp3ButtonsLocal.forEach(button => {
     button.addEventListener('click', () => {
         const statusData = statusMap[button.id];
         if (statusData) {
             setStatus(statusData.display, statusData.textElement, statusData.iconElement, statusData.descriptionElement, statusData.statusClass, statusData.statusText, statusData.iconCode, statusData.descriptionText, statusData.sound);
         }
     });
 });

// Add event listeners to camera buttons (New)
cameraButtons.forEach(button => {
    button.addEventListener('click', () => {
        const statusData = statusMap[button.id];
        if (statusData) {
            // Call setStatus with correct parameters for camera
            setStatus(statusData.display, statusData.textElement, statusData.iconElement, statusData.descriptionElement, statusData.statusClass, statusData.statusText, statusData.iconCode, statusData.descriptionText, statusData.sound);
        }
    });
});

// Add event listeners to console buttons
consoleButtons.forEach(button => {
    button.addEventListener('click', () => {
        const statusData = statusMap[button.id];
        if (statusData) {
            // Call setStatus with correct parameters for console
            setStatus(statusData.display, statusData.textElement, statusData.iconElement, statusData.descriptionElement, statusData.statusClass, statusData.statusText, statusData.iconCode, statusData.descriptionText, statusData.sound);
        }
    });
});

// Add event listeners to TV buttons
tvButtons.forEach(button => {
    button.addEventListener('click', () => {
        const statusData = statusMap[button.id];
        if (statusData) {
            // Call setStatus with correct parameters for TV
            setStatus(statusData.display, statusData.textElement, statusData.iconElement, statusData.descriptionElement, statusData.statusClass, statusData.statusText, statusData.iconCode, statusData.descriptionText, statusData.sound);
        }
    });
});

// Add event listeners to Trash Can buttons
trashButtons.forEach(button => {
    button.addEventListener('click', () => {
        const statusData = statusMap[button.id];
        if (statusData) {
            // Call setStatus with correct parameters for Trash Can
            setStatus(statusData.display, statusData.textElement, statusData.iconElement, statusData.descriptionElement, statusData.statusClass, statusData.statusText, statusData.iconCode, statusData.descriptionText, statusData.sound);
        }
    });
});

// Add event listeners to HTTP buttons
httpButtons.forEach(button => {
    button.addEventListener('click', () => {
        const statusData = statusMap[button.id];
        if (statusData) {
            setStatus(statusData.display, statusData.textElement, statusData.iconElement, statusData.descriptionElement, statusData.statusClass, statusData.statusText, statusData.iconCode, statusData.descriptionText, statusData.sound);
        }
    });
});

// Set initial statuses on load
window.addEventListener('load', () => {
    // System initial
    setStatus(systemStatusDisplay, systemStatusText, systemStatusIcon, systemStatusDescription, 'initial', 'Initializing...', 'report', 'System is starting up and performing initial checks.', 'booting.mp3');

    // Wifi initial - Use the data from statusMap for consistency
    const initialWifiStatus = statusMap['btn-wifi-unknown'];
    setStatus(initialWifiStatus.display, initialWifiStatus.textElement, initialWifiStatus.iconElement, initialWifiStatus.descriptionElement, initialWifiStatus.statusClass, initialWifiStatus.statusText, initialWifiStatus.iconCode, initialWifiStatus.descriptionText, initialWifiStatus.sound);

    // Battery initial - Use the data from statusMap for consistency
    const initialBatteryStatus = statusMap['btn-battery-unknown'];
    setStatus(initialBatteryStatus.display, initialBatteryStatus.textElement, initialBatteryStatus.iconElement, initialBatteryStatus.descriptionElement, initialBatteryStatus.statusClass, initialBatteryStatus.statusText, initialBatteryStatus.iconCode, initialBatteryStatus.descriptionText, initialBatteryStatus.sound);

    // Volume initial - Set initial status for the new Volume section
    const initialVolumeStatus = statusMap['btn-volume-unknown'];
    setStatus(volumeStatusDisplay, volumeStatusText, volumeStatusIcon, volumeStatusDescription, initialVolumeStatus.statusClass, initialVolumeStatus.statusText, initialVolumeStatus.iconCode, initialVolumeStatus.descriptionText, initialVolumeStatus.sound);

    // Internet/Browsing initial - Set initial status for the new section (New)
     const initialInternetStatus = { display: internetStatusDisplay, textElement: internetStatusText, iconElement: internetStatusIcon, descriptionElement: internetStatusDescription, statusClass: 'initial', statusText: 'Internet Status: Unknown', iconCode: 'wifi_off', descriptionText: 'Internet and browsing status could not be determined.', sound: 'notfound.mp3' }; // Use notfound sound for unknown
     setStatus(initialInternetStatus.display, initialInternetStatus.textElement, initialInternetStatus.iconElement, initialInternetStatus.descriptionElement, initialInternetStatus.statusClass, initialInternetStatus.statusText, initialInternetStatus.iconCode, initialInternetStatus.descriptionText, initialInternetStatus.sound);

    // Microphone initial - Set initial status for the new Microphone section (New)
     const initialMicrophoneStatus = { display: microphoneStatusDisplay, textElement: microphoneStatusText, iconElement: microphoneStatusIcon, descriptionElement: microphoneStatusDescription, statusClass: 'initial', statusText: 'Microphone Status: Unknown', iconCode: 'mic_off', descriptionText: 'Microphone status could not be determined.', sound: 'notfound.mp3' }; // Use notfound sound for unknown
     setStatus(initialMicrophoneStatus.display, initialMicrophoneStatus.textElement, initialMicrophoneStatus.iconElement, initialMicrophoneStatus.descriptionElement, initialMicrophoneStatus.statusClass, initialMicrophoneStatus.statusText, initialMicrophoneStatus.iconCode, initialMicrophoneStatus.descriptionText, initialMicrophoneStatus.sound);

     // Phone initial - Set initial status for the new Phone section
     const initialPhoneStatus = { display: phoneStatusDisplay, textElement: phoneStatusText, iconElement: phoneStatusIcon, descriptionElement: phoneStatusDescription, statusClass: 'initial', statusText: 'Phone Status: Unknown', iconCode: 'phone_android', descriptionText: 'Phone status could not be determined.', sound: 'notfound.mp3' }; // Use notfound sound for unknown
     setStatus(initialPhoneStatus.display, initialPhoneStatus.textElement, initialPhoneStatus.iconElement, initialPhoneStatus.descriptionElement, initialPhoneStatus.statusClass, initialPhoneStatus.statusText, initialPhoneStatus.iconCode, initialPhoneStatus.descriptionText, initialPhoneStatus.sound);

     // Camera initial - Set initial status for the new Camera section
     const initialCameraStatus = { display: cameraStatusDisplay, textElement: cameraStatusText, iconElement: cameraStatusIcon, descriptionElement: cameraStatusDescription, statusClass: 'initial', statusText: 'Camera Status: Unknown', iconCode: 'camera_alt', descriptionText: 'Camera status could not be determined.', sound: 'notfound.mp3' }; // Use notfound sound for unknown
     setStatus(initialCameraStatus.display, initialCameraStatus.textElement, initialCameraStatus.iconElement, initialCameraStatus.descriptionElement, initialCameraStatus.statusClass, initialCameraStatus.statusText, initialCameraStatus.iconCode, initialCameraStatus.descriptionText, initialCameraStatus.sound);

     // MP3 Player initial - Set initial status for MP3 Player section
     if (mp3StatusDisplay) {
         const initialMP3Status = { display: mp3StatusDisplay, textElement: mp3StatusText, iconElement: mp3StatusIcon, descriptionElement: mp3StatusDescription, statusClass: 'initial', statusText: 'MP3 Player: Unknown', iconCode: 'audiotrack', descriptionText: 'MP3 player status could not be determined.', sound: 'notfound.mp3' };
         setStatus(initialMP3Status.display, initialMP3Status.textElement, initialMP3Status.iconElement, initialMP3Status.descriptionElement, initialMP3Status.statusClass, initialMP3Status.statusText, initialMP3Status.iconCode, initialMP3Status.descriptionText, initialMP3Status.sound);
     }

    // Console initial - Set initial status for the new Console section
    const initialConsoleStatus = { display: consoleStatusDisplay, textElement: consoleStatusText, iconElement: consoleStatusIcon, descriptionElement: consoleStatusDescription, statusClass: 'initial', statusText: 'Console Status: Unknown', iconCode: 'gamepad', descriptionText: 'Console status could not be determined.', sound: 'notfound.mp3' };
    setStatus(initialConsoleStatus.display, initialConsoleStatus.textElement, initialConsoleStatus.iconElement, initialConsoleStatus.descriptionElement, initialConsoleStatus.statusClass, initialConsoleStatus.statusText, initialConsoleStatus.iconCode, initialConsoleStatus.descriptionText, initialConsoleStatus.sound);

    // TV initial - Set initial status for the new TV section
    const initialTVStatus = { display: tvStatusDisplay, textElement: tvStatusText, iconElement: tvStatusIcon, descriptionElement: tvStatusDescription, statusClass: 'initial', statusText: 'TV Status: Unknown', iconCode: 'tv', descriptionText: 'TV status could not be determined.', sound: 'notfound.mp3' };
    setStatus(initialTVStatus.display, initialTVStatus.textElement, initialTVStatus.iconElement, initialTVStatus.descriptionElement, initialTVStatus.statusClass, initialTVStatus.statusText, initialTVStatus.iconCode, initialTVStatus.descriptionText, initialTVStatus.sound);

    // Trash Can initial - Set initial status for the new Trash Can section
    const initialTrashStatus = { display: trashStatusDisplay, textElement: trashStatusText, iconElement: trashStatusIcon, descriptionElement: trashStatusDescription, statusClass: 'initial', statusText: 'Trash Can Status: Unknown', iconCode: 'delete', descriptionText: 'Trash can status could not be determined.', sound: 'notfound.mp3' };
    setStatus(initialTrashStatus.display, initialTrashStatus.textElement, initialTrashStatus.iconElement, initialTrashStatus.descriptionElement, initialTrashStatus.statusClass, initialTrashStatus.statusText, initialTrashStatus.iconCode, initialTrashStatus.descriptionText, initialTrashStatus.sound);

    // HTTP initial - set to unknown
    const initialHTTPStatus = { display: httpStatusDisplay, textElement: httpStatusText, iconElement: httpStatusIcon, descriptionElement: httpStatusDescription, statusClass: 'initial', statusText: 'HTTP Status: Unknown', iconCode: 'http', descriptionText: 'HTTP status could not be determined.', sound: 'notfound.mp3' };
    if (httpStatusDisplay) {
        setStatus(initialHTTPStatus.display, initialHTTPStatus.textElement, initialHTTPStatus.iconElement, initialHTTPStatus.descriptionElement, initialHTTPStatus.statusClass, initialHTTPStatus.statusText, initialHTTPStatus.iconCode, initialHTTPStatus.descriptionText, initialHTTPStatus.sound);
    }

    // Count total number of status options
    const statusCounter = document.getElementById('status-count');
    // Count all buttons across all status sections
    const totalStatusCount = document.querySelectorAll('.controls button').length;
    statusCounter.textContent = totalStatusCount;
});