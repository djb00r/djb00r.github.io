class MultiplayerManager {
  constructor(game) {
    this.game = game;
    this.room = null;
    this.playerColor = null;
  }

  async initializeMultiplayer() {
    this.room = new WebsimSocket();
    this.setupMultiplayerHandlers();
    this.determinePlayerColor();
  }

  determinePlayerColor() {
    // First player to join is white, second is black
    this.room.party.subscribe((peers) => {
      const peerIds = Object.keys(peers);
      const myIndex = peerIds.indexOf(this.room.party.client.id);
      this.playerColor = myIndex === 0 ? 'white' : 'black';
      this.game.updateStatus();
    });
  }

  setupMultiplayerHandlers() {
    this.room.onmessage = (event) => {
      const data = event.data;
      switch (data.type) {
        case 'move':
          if (data.clientId !== this.room.party.client.id) {
            this.game.makeMove(data.fromRow, data.fromCol, data.toRow, data.toCol);
          }
          break;
        case 'restart':
          if (data.clientId !== this.room.party.client.id) {
            this.game.restart();
          }
          break;
      }
    };
  }

  sendMove(fromRow, fromCol, toRow, toCol) {
    this.room.send({
      type: 'move',
      fromRow,
      fromCol,
      toRow,
      toCol
    });
  }

  sendRestart() {
    this.room.send({
      type: 'restart'
    });
  }

  isMyTurn() {
    return this.game.currentPlayer === this.playerColor;
  }

  cleanup() {
    if (this.room) {
      // Cleanup WebSocket connection
      this.room = null;
    }
  }
}