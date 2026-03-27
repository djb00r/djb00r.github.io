export class MultiplayerChat {
    constructor(chatUI) {
        this.chatUI = chatUI;
        this.socket = null;
        this.initializeWebSocket();
    }

    initializeWebSocket() {
        // Replace with actual WebSocket URL
        this.socket = new WebSocket('ws://localhost:8080'); // Replace with actual WebSocket URL

        this.socket.onmessage = (event) => {
            this.handleIncomingMessage(event.data);
        };

        this.socket.onopen = () => {
            console.log('Connected to the WebSocket server');
        };

        this.socket.onclose = () => {
            console.log('Disconnected from the WebSocket server');
        };

        this.socket.onerror = (error) => {
            console.log('Error occurred while connecting to the WebSocket server');
            console.log(error);
        };
    }

    sendMessage(message) {
        if (this.socket) {
            this.socket.send(JSON.stringify({
                type: 'chat_message',
                content: message,
                sender: 'User'
            }));
        }
    }

    handleIncomingMessage(data) {
        const jsonData = JSON.parse(data);
        if (jsonData.type === 'chat_message') {
            // Add message from other users
            this.chatUI.addMessage(jsonData.sender, jsonData.content);
        } else if (jsonData.type === 'user_joined') {
            this.chatUI.addChatter(jsonData.username, jsonData.personality, jsonData.color);
        } else if (jsonData.type === 'user_left') {
            this.chatUI.removeChatter(jsonData.username);
        }
    }

    joinChat(userData) {
        if (this.socket) {
            this.socket.send(JSON.stringify({
                type: 'join_chat',
                user: userData
            }));
        }
    }

    leaveChat() {
        if (this.socket) {
            this.socket.send(JSON.stringify({
                type: 'leave_chat'
            }));
        }
    }
}