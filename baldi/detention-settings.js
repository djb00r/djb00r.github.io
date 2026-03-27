import { config } from './config.js';

export class DetentionSettings {
    constructor() {
        this.createSettingsPanel();
    }

    createSettingsPanel() {
        const settingsContainer = document.createElement('div');
        settingsContainer.className = 'detention-settings';
        settingsContainer.style.position = 'fixed';
        settingsContainer.style.top = '100px';
        settingsContainer.style.left = '20px';
        settingsContainer.style.background = 'white';
        settingsContainer.style.padding = '15px';
        settingsContainer.style.borderRadius = '8px';
        settingsContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        settingsContainer.style.zIndex = '1000';
        settingsContainer.style.display = 'none';

        settingsContainer.innerHTML = `
            <h3>Detention Settings</h3>
            <div class="setting-item">
                <input type="checkbox" id="videoDetentionToggle" ${config.settings.videoDetention ? 'checked' : ''}>
                <label for="videoDetentionToggle">Enable Video Detention</label>
            </div>
            <div class="setting-item">
                <label for="detentionDuration">Detention Duration (seconds):</label>
                <input type="number" id="detentionDuration" min="1" max="60" value="${config.settings.detentionDuration}">
            </div>
            <button id="saveDetentionSettings">Save Settings</button>
        `;

        document.body.appendChild(settingsContainer);

        const settingsButton = document.createElement('button');
        settingsButton.textContent = '⚙️ Detention Settings';
        settingsButton.className = 'detention-settings-btn';
        settingsButton.style.position = 'fixed';
        settingsButton.style.top = '60px';
        settingsButton.style.left = '20px';
        settingsButton.style.padding = '8px 15px';
        settingsButton.style.background = '#ff4444';
        settingsButton.style.color = 'white';
        settingsButton.style.border = 'none';
        settingsButton.style.borderRadius = '4px';
        settingsButton.style.cursor = 'pointer';
        settingsButton.style.zIndex = '1000';

        document.body.appendChild(settingsButton);

        settingsButton.addEventListener('click', () => {
            settingsContainer.style.display = 
                settingsContainer.style.display === 'none' ? 'block' : 'none';
        });

        const saveButton = document.getElementById('saveDetentionSettings');
        const videoDetentionToggle = document.getElementById('videoDetentionToggle');
        const detentionDurationInput = document.getElementById('detentionDuration');

        saveButton.addEventListener('click', () => {
            config.settings.videoDetention = videoDetentionToggle.checked;
            config.settings.detentionDuration = parseInt(detentionDurationInput.value) || 10;
            settingsContainer.style.display = 'none';
            alert('Detention settings saved!');
        });
    }
}