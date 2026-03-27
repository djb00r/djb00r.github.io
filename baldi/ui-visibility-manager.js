export class UIVisibilityManager {
    constructor() {
        this.setupVisibilityControls();
    }

    setupVisibilityControls() {
        // Setup chat container close button
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
            const chatCloseBtn = document.createElement('button');
            chatCloseBtn.innerHTML = '×';
            chatCloseBtn.className = 'close-btn';
            chatCloseBtn.title = 'Minimize Chat';
            chatContainer.querySelector('.chat-header').appendChild(chatCloseBtn);

            chatCloseBtn.onclick = () => {
                chatContainer.style.display = 'none';
                this.createShowButton('chat');
            };
        }

        // Setup stream rules close button
        const rulesContainer = document.querySelector('.stream-rules');
        if (rulesContainer) {
            const rulesCloseBtn = document.createElement('button');
            rulesCloseBtn.innerHTML = '×';
            rulesCloseBtn.className = 'close-btn';
            rulesCloseBtn.title = 'Minimize Rules';
            
            // Append the close button to the h3 element
            const rulesHeader = rulesContainer.querySelector('h3');
            if (rulesHeader) {
                rulesHeader.appendChild(rulesCloseBtn);
            }

            rulesCloseBtn.onclick = () => {
                rulesContainer.style.display = 'none';
                this.createShowButton('rules');
            };
        }
    }

    createShowButton(type) {
        const showBtn = document.createElement('button');
        showBtn.className = `show-element-btn ${type}-btn`;
        showBtn.textContent = type === 'chat' ? 'Show Chat' : 'Show Rules';

        showBtn.onclick = () => {
            const element = type === 'chat' ? 
                document.querySelector('.chat-container') : 
                document.querySelector('.stream-rules');
            element.style.display = type === 'chat' ? 'flex' : 'block';
            showBtn.remove();
        };

        document.body.appendChild(showBtn);
    }
}