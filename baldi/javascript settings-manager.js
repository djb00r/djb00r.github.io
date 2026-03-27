import { config } from './config.js';

export class SettingsManager {
    constructor() {
        this.createSettingsButton();
        this.createSettingsPanel();
    }

    createSettingsButton() {
        const settingsButton = document.createElement('button');
        settingsButton.textContent = '⚙️ Settings';
        settingsButton.className = 'settings-btn';
        settingsButton.style.position = 'fixed';
        settingsButton.style.top = '20px';
        settingsButton.style.left = '20px';
        settingsButton.style.padding = '8px 15px';
        settingsButton.style.background = '#2196F3';
        settingsButton.style.color = 'white';
        settingsButton.style.border = 'none';
        settingsButton.style.borderRadius = '4px';
        settingsButton.style.cursor = 'pointer';
        settingsButton.style.zIndex = '1001';

        document.body.appendChild(settingsButton);
        return settingsButton;
    }

    createSettingsPanel() {
        const settingsPanel = document.createElement('div');
        settingsPanel.className = 'settings-panel';
        settingsPanel.style.position = 'fixed';
        settingsPanel.style.top = '60px';
        settingsPanel.style.left = '20px';
        settingsPanel.style.background = 'white';
        settingsPanel.style.border = '1px solid #ddd';
        settingsPanel.style.borderRadius = '8px';
        settingsPanel.style.padding = '15px';
        settingsPanel.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        settingsPanel.style.zIndex = '1002';
        settingsPanel.style.display = 'none';
        settingsPanel.style.width = '250px';

        settingsPanel.innerHTML = `
            <h3>Settings</h3>
            <div class="settings-toggle">
                <input type="checkbox" id="videoDetentionToggle">
                <label for="videoDetentionToggle">Video Detention</label>
            </div>
            <div class="settings-toggle">
                <input type="checkbox" id="chatToggle">
                <label for="chatToggle">Enable Chat</label>
            </div>
            <div class="settings-toggle">
                <input type="checkbox" id="livestreamRulesToggle">
                <label for="livestreamRulesToggle">Livestream Rules</label>
            </div>
            <div class="settings-toggle">
                <label for="detentionDuration">Detention Duration (seconds):</label>
                <input type="number" id="detentionDuration" min="1" max="60">
            </div>
        `;

        document.body.appendChild(settingsPanel);

        // Get elements
        const videoDetentionToggle = settingsPanel.querySelector('#videoDetentionToggle');
        const chatToggle = settingsPanel.querySelector('#chatToggle');
        const livestreamRulesToggle = settingsPanel.querySelector('#livestreamRulesToggle');
        const detentionDurationInput = settingsPanel.querySelector('#detentionDuration');

        // Set initial states (all off by default)
        videoDetentionToggle.checked = false;
        chatToggle.checked = false;
        livestreamRulesToggle.checked = false;
        detentionDurationInput.value = 10;

        // Event listeners for settings
        videoDetentionToggle.addEventListener('change', (e) => {
            config.settings.videoDetention = e.target.checked;
        });

        chatToggle.addEventListener('change', (e) => {
            config.settings.chatEnabled = e.target.checked;
            this.toggleChat(e.target.checked);
        });

        livestreamRulesToggle.addEventListener('change', (e) => {
            config.settings.livestreamRules = e.target.checked;
        });

        detentionDurationInput.addEventListener('change', (e) => {
            config.settings.detentionDuration = parseInt(e.target.value);
        });

        // Toggle settings panel
        const settingsButton = this.createSettingsButton();
        settingsButton.addEventListener('click', () => {
            settingsPanel.style.display = 
                settingsPanel.style.display === 'none' ? 'block' : 'none';
        });

        // Close panel when clicking outside
        document.addEventListener('click', (event) => {
            if (!settingsPanel.contains(event.target) && 
                !settingsButton.contains(event.target) && 
                settingsPanel.style.display === 'block') {
                settingsPanel.style.display = 'none';
            }
        });
    }

    toggleChat(enabled) {
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
            chatContainer.style.display = enabled ? 'block' : 'none';
        }
    }
}