export class CharacterListPopup {
    constructor() {
        this.createSettingsButton();
        this.createCharacterListButton();
    }

    createSettingsButton() {
        const settingsButton = document.createElement('button');
        settingsButton.textContent = '⚙️';
        settingsButton.className = 'settings-btn';
        settingsButton.style.position = 'absolute';
        settingsButton.style.top = '0';
        settingsButton.style.right = '-40px'; // Position next to Assist Baldi button
        settingsButton.style.padding = '8px 15px';
        settingsButton.style.background = '#2196F3';
        settingsButton.style.color = 'white';
        settingsButton.style.border = 'none';
        settingsButton.style.borderRadius = '4px';
        settingsButton.style.cursor = 'pointer';
        settingsButton.style.zIndex = '1001';

        // Create settings panel
        const settingsPanel = document.createElement('div');
        settingsPanel.className = 'settings-panel';
        import('./config.js').then(module => {
            const config = module.config;

            settingsPanel.innerHTML = `
                <h3>Settings</h3>
                <div class="settings-toggle">
                    <input type="checkbox" id="videoDetentionToggle" ${config.settings.videoDetention ? 'checked' : ''}>
                    <label for="videoDetentionToggle">Video Detention</label>
                </div>
                <div class="settings-toggle">
                    <input type="checkbox" id="chatToggle" ${config.settings.chatEnabled ? 'checked' : ''}>
                    <label for="chatToggle">Chat Enabled</label>
                </div>
                <div class="settings-toggle">
                    <input type="checkbox" id="livestreamRulesToggle" ${config.settings.livestreamRules ? 'checked' : ''}>
                    <label for="livestreamRulesToggle">Livestream Rules</label>
                </div>
                <div class="settings-toggle">
                    <label for="detentionDuration">Detention Duration (seconds):</label>
                    <input type="number" id="detentionDuration" value="${config.settings.detentionDuration}" min="1" max="60">
                </div>
            `;
            settingsPanel.style.display = 'none';

            // Position the settings panel relative to the button
            settingsPanel.style.position = 'absolute';
            settingsPanel.style.top = '40px';
            settingsPanel.style.right = '-40px';

            // Append settings panel to a container near the assist section
            const assistSection = document.querySelector('.assist-section');
            const settingsContainer = document.createElement('div');
            settingsContainer.style.position = 'relative';
            settingsContainer.appendChild(settingsButton);
            settingsContainer.appendChild(settingsPanel);
            assistSection.appendChild(settingsContainer);

            settingsButton.addEventListener('click', () => {
                settingsPanel.style.display = 
                    settingsPanel.style.display === 'none' ? 'block' : 'none';
            });

            // Add event listeners to save settings
            const videoDetentionToggle = settingsPanel.querySelector('#videoDetentionToggle');
            const chatToggle = settingsPanel.querySelector('#chatToggle');
            const livestreamRulesToggle = settingsPanel.querySelector('#livestreamRulesToggle');
            const detentionDurationInput = settingsPanel.querySelector('#detentionDuration');

            videoDetentionToggle.addEventListener('change', (e) => {
                config.settings.videoDetention = e.target.checked;
            });

            chatToggle.addEventListener('change', (e) => {
                config.settings.chatEnabled = e.target.checked;
                // Optionally add logic to enable/disable chat
                const chatContainer = document.querySelector('.chat-container');
                if (chatContainer) {
                    chatContainer.style.display = e.target.checked ? 'block' : 'none';
                }
            });

            livestreamRulesToggle.addEventListener('change', (e) => {
                config.settings.livestreamRules = e.target.checked;
            });

            detentionDurationInput.addEventListener('change', (e) => {
                config.settings.detentionDuration = parseInt(e.target.value);
            });
        });
    }

    createCharacterListButton() {
        const button = document.createElement('button');
        button.textContent = '👥 Characters';
        button.className = 'characters-list-btn';
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.right = '90px';  // Adjusted to make room for settings button
        button.style.padding = '8px 15px';
        button.style.background = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1001';

        // Existing popup creation logic remains the same...
        this.createPopup(button);
    }

    createPopup(button) {
        const popup = document.createElement('div');
        popup.className = 'characters-popup';
        popup.style.display = 'none';
        popup.style.position = 'fixed';
        popup.style.top = '60px';
        popup.style.right = '20px';
        popup.style.width = '300px';
        popup.style.maxHeight = '500px';
        popup.style.overflowY = 'auto';
        popup.style.background = 'white';
        popup.style.border = '1px solid #ddd';
        popup.style.borderRadius = '8px';
        popup.style.padding = '15px';
        popup.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        popup.style.zIndex = '1002';

        // Populate popup with characters
        import('./config.js').then(module => {
            const characters = module.config.defaultChatters;

            const title = document.createElement('h2');
            title.textContent = 'Here School Characters';
            title.style.borderBottom = '1px solid #ddd';
            title.style.paddingBottom = '10px';
            popup.appendChild(title);

            characters.forEach(character => {
                const characterDiv = document.createElement('div');
                characterDiv.style.marginBottom = '15px';
                characterDiv.style.paddingBottom = '10px';
                characterDiv.style.borderBottom = '1px solid #eee';

                const nameDiv = document.createElement('div');
                nameDiv.innerHTML = `<strong>${character.name}</strong>`;
                nameDiv.style.color = character.color;

                const personalityDiv = document.createElement('div');
                personalityDiv.textContent = character.personality;
                personalityDiv.style.fontSize = '0.9em';
                personalityDiv.style.color = '#666';

                const extraDetailsDiv = document.createElement('div');
                extraDetailsDiv.style.fontSize = '0.8em';
                extraDetailsDiv.style.color = '#888';
                
                switch(character.name) {
                    case 'PaperDad':
                        extraDetailsDiv.textContent = 'Known for going out for milk 6 years ago, leaving behind legendary paper-related stories.';
                        break;
                    case 'Maldi':
                        extraDetailsDiv.textContent = 'Baldi\'s nephew, sharing a passion for mathematical precision and precision.';
                        break;
                    case 'CodeTime':
                        extraDetailsDiv.textContent = 'Playtime\'s coding-loving brother, bridging the world of play and technology.';
                        break;
                }

                characterDiv.appendChild(nameDiv);
                characterDiv.appendChild(personalityDiv);
                characterDiv.appendChild(extraDetailsDiv);

                popup.appendChild(characterDiv);
            });

            document.body.appendChild(popup);

            // Toggle popup visibility
            button.addEventListener('click', () => {
                popup.style.display = 
                    popup.style.display === 'none' ? 'block' : 'none';
            });

            // Close popup when clicking outside
            document.addEventListener('click', (event) => {
                if (!popup.contains(event.target) && 
                    !button.contains(event.target) && 
                    popup.style.display === 'block') {
                    popup.style.display = 'none';
                }
            });
        });

        document.body.appendChild(button);
    }
}