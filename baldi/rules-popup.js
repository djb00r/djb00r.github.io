import { config } from './config.js';

export function createRulesButton() {
    const rulesButton = document.createElement('button');
    rulesButton.textContent = '📜 Rules';
    rulesButton.className = 'rules-btn';
    rulesButton.style.position = 'fixed';
    rulesButton.style.bottom = '20px';
    rulesButton.style.left = '20px';
    rulesButton.style.padding = '8px 15px';
    rulesButton.style.background = '#4CAF50';
    rulesButton.style.color = 'white';
    rulesButton.style.border = 'none';
    rulesButton.style.borderRadius = '4px';
    rulesButton.style.cursor = 'pointer';
    rulesButton.style.zIndex = '1000';

    document.body.appendChild(rulesButton);

    rulesButton.addEventListener('click', () => {
        const rulesPopup = document.querySelector('.stream-rules');
        rulesPopup.style.display = 'block';
    });
}

export function createRulesPopup() {
    const rulesContainer = document.createElement('div');
    rulesContainer.className = 'stream-rules';
    rulesContainer.style.position = 'fixed';
    rulesContainer.style.top = '50%';
    rulesContainer.style.left = '50%';
    rulesContainer.style.transform = 'translate(-50%, -50%)';
    rulesContainer.style.background = '#ADD8E6';
    rulesContainer.style.padding = '15px';
    rulesContainer.style.borderRadius = '8px';
    rulesContainer.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    rulesContainer.style.width = '250px';
    rulesContainer.style.zIndex = '1001';
    rulesContainer.style.border = '2px solid #87CEEB';
    rulesContainer.style.display = 'none';  // Hidden by default

    rulesContainer.innerHTML = `
        <h3>Livestream Rules!</h3>
        <p>When you follow the livestream rules:</p>
        <ul>
            <li>No spamming</li>
            <li>No self-promotion</li>
            <li>No bullying or harassment</li>
            <li>No talk of drugs or alcohol</li>
            <li>No inappropriate food requests</li>
            <li>No stream sniping</li>
            <li>No breaking the stream's theme</li>
            <li>No sharing personal info</li>
            <li>No late-night trolling</li>
            <li>No entering restricted areas</li>
        </ul>
        <p class="warning">If you break the rules, the Principal will catch you and wait for 15 seconds before detention is over!</p>
    `;

    document.body.appendChild(rulesContainer);

    // Add close button to the rules popup
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.className = 'close-btn';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '5px';
    closeBtn.style.right = '5px';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.fontSize = '20px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.color = 'black';
    closeBtn.style.padding = '0';
    closeBtn.style.lineHeight = '1';
    closeBtn.style.width = '20px';
    closeBtn.style.height = '20px';
    closeBtn.style.display = 'flex';
    closeBtn.style.alignItems = 'center';
    closeBtn.style.justifyContent = 'center';
    closeBtn.style.zIndex = '1002';

    rulesContainer.appendChild(closeBtn);

    closeBtn.onclick = () => {
        rulesContainer.style.display = 'none';
    };
}