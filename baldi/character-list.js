export class CharacterListPopup {
    constructor() {
        this.createCharacterListButton();
    }

    createCharacterListButton() {
        const button = document.createElement('button');
        button.textContent = '👥 Characters';
        button.className = 'characters-list-btn';
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.right = '90px';
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