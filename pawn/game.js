class PawnGame {
  constructor() {
    this.board = Array(8).fill().map(() => Array(8).fill(null));
    this.currentPlayer = 'white';
    this.selectedPawn = null;
    this.gameOver = false;
    this.lastDoubleMoveColumn = null;
    this.lastDoubleMoveRow = null;
    this.moveHistory = [];
    this.currentMoveIndex = -1;
    this.botMode = true;
    this.botColor = 'black';
    this.botLevel = 5;
    this.gameMode = 'bot';
    this.botVsBot = false;
    this.whiteBotLevel = 5;
    this.blackBotLevel = 5;
    
    // Initialize bot and multiplayer managers
    this.bot = new ChessBot(this);
    this.multiplayer = new MultiplayerManager(this);
    
    this.init();
    this.setupEventListeners();
  }

  init() {
    // Place white pawns
    for (let i = 0; i < 8; i++) {
      this.board[6][i] = 'white';
    }
    // Place black pawns
    for (let i = 0; i < 8; i++) {
      this.board[1][i] = 'black';
    }
    this.createBoard();
    this.updateStatus();
    this.updateNavigationButtons();
  }

  setupEventListeners() {
    // Game mode selection
    document.getElementById('game-mode').addEventListener('change', (e) => {
      this.changeGameMode(e.target.value);
    });

    // Bot mode controls
    document.getElementById('bot-mode').addEventListener('change', (e) => {
      this.botMode = e.target.checked;
      document.getElementById('difficulty-slider').disabled = !e.target.checked;
      this.restart();
    });

    // Bot vs Bot controls
    document.getElementById('white-bot-slider').addEventListener('input', (e) => {
      this.whiteBotLevel = parseInt(e.target.value);
      document.getElementById('white-bot-level').textContent = this.whiteBotLevel;
    });

    document.getElementById('black-bot-slider').addEventListener('input', (e) => {
      this.blackBotLevel = parseInt(e.target.value);
      document.getElementById('black-bot-level').textContent = this.blackBotLevel;
    });

    // Start/Stop Bot vs Bot
    document.getElementById('bot-vs-bot-toggle').addEventListener('change', (e) => {
      this.botVsBot = e.target.checked;
      if (this.botVsBot) {
        this.startBotVsBot();
      }
    });

    // Existing difficulty slider code
    const difficultySlider = document.getElementById('difficulty-slider');
    const difficultyValue = document.getElementById('difficulty-value');
    
    difficultySlider.addEventListener('input', (e) => {
      this.botLevel = parseInt(e.target.value);
      difficultyValue.textContent = this.botLevel;
      if (this.botMode && this.currentPlayer === this.botColor) {
        this.bot.makeBotMove();
      }
    });

    // Navigation buttons
    document.getElementById('restart-btn').addEventListener('click', () => this.restart());
    document.getElementById('rewind-btn').addEventListener('click', () => this.rewindMove());
    document.getElementById('forward-btn').addEventListener('click', () => this.forwardMove());
  }

  async changeGameMode(mode) {
    this.gameMode = mode;
    const botControls = document.getElementById('bot-controls');
    const botVsBotControls = document.getElementById('bot-vs-bot-controls');
    
    switch (mode) {
      case 'bot':
        botControls.style.display = 'block';
        botVsBotControls.style.display = 'none';
        this.botMode = true;
        this.botVsBot = false;
        this.multiplayer.cleanup();
        break;
      case 'botvsbot':
        botControls.style.display = 'none';
        botVsBotControls.style.display = 'block';
        this.botMode = false;
        this.botVsBot = true;
        this.multiplayer.cleanup();
        break;
      case 'multiplayer':
        botControls.style.display = 'none';
        botVsBotControls.style.display = 'none';
        this.botMode = false;
        this.botVsBot = false;
        await this.multiplayer.initializeMultiplayer();
        break;
      case 'local':
        botControls.style.display = 'none';
        botVsBotControls.style.display = 'none';
        this.botMode = false;
        this.botVsBot = false;
        this.multiplayer.cleanup();
        break;
    }
    
    this.restart();
  }

  async startBotVsBot() {
    if (!this.botVsBot || this.gameOver) return;
    
    // Set bot levels based on current player
    this.bot.botLevel = this.currentPlayer === 'white' ? this.whiteBotLevel : this.blackBotLevel;
    
    // Make move for current bot
    await this.bot.makeBotMove();
    
    // Schedule next bot move
    if (!this.gameOver) {
      setTimeout(() => this.startBotVsBot(), 500);
    }
  }

  createBoard() {
    const chessboard = document.getElementById('chessboard');
    chessboard.innerHTML = '';

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = document.createElement('div');
        square.className = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
        square.dataset.row = row;
        square.dataset.col = col;

        if (this.board[row][col]) {
          const pawn = document.createElement('div');
          pawn.className = `pawn ${this.board[row][col]}-pawn`;
          square.appendChild(pawn);
        }

        square.addEventListener('click', (e) => this.handleSquareClick(row, col));
        chessboard.appendChild(square);
      }
    }
  }

  async handleSquareClick(row, col) {
    if (this.gameOver || this.currentMoveIndex < this.moveHistory.length - 1) return;
    
    // Check if it's player's turn in multiplayer mode
    if (this.gameMode === 'multiplayer' && !this.multiplayer.isMyTurn()) {
      return;
    }

    // Check if it's bot's turn in bot mode
    if (this.botMode && this.currentPlayer === this.botColor) {
      return;
    }

    if (this.selectedPawn) {
      if (this.isValidMove(this.selectedPawn.row, this.selectedPawn.col, row, col)) {
        await this.makeMove(this.selectedPawn.row, this.selectedPawn.col, row, col);
        
        // Send move to other player in multiplayer mode
        if (this.gameMode === 'multiplayer') {
          this.multiplayer.sendMove(this.selectedPawn.row, this.selectedPawn.col, row, col);
        }
        
        // Make bot move if it's bot's turn
        if (!this.gameOver && this.botMode && this.currentPlayer === this.botColor) {
          await this.bot.makeBotMove();
        }
      }
      this.selectedPawn = null;
      this.removeHighlights();
    } else {
      if (this.board[row][col] === this.currentPlayer) {
        this.selectedPawn = { row, col };
        this.highlightSquare(row, col);
        this.showValidMoves(row, col);
      }
    }
  }

  async makeMove(fromRow, fromCol, toRow, toCol) {
    const isDoubleMove = Math.abs(fromRow - toRow) === 2;
    const moveData = {
      fromRow,
      fromCol,
      toRow,
      toCol,
      capturedPawn: null,
      isDoubleMove,
      lastDoubleMoveColumn: this.lastDoubleMoveColumn,
      lastDoubleMoveRow: this.lastDoubleMoveRow
    };
    
    if (isDoubleMove) {
      this.lastDoubleMoveColumn = toCol;
      this.lastDoubleMoveRow = toRow;
    } else {
      const isEnPassant = this.isEnPassantCapture(fromRow, fromCol, toRow, toCol);
      if (isEnPassant) {
        moveData.capturedPawn = {
          row: this.lastDoubleMoveRow,
          col: this.lastDoubleMoveColumn,
          type: this.board[this.lastDoubleMoveRow][this.lastDoubleMoveColumn]
        };
        this.board[this.lastDoubleMoveRow][this.lastDoubleMoveColumn] = null;
      }
      this.lastDoubleMoveColumn = null;
      this.lastDoubleMoveRow = null;
    }

    this.movePawn(fromRow, fromCol, toRow, toCol);
    
    this.moveHistory = this.moveHistory.slice(0, this.currentMoveIndex + 1);
    this.moveHistory.push(moveData);
    this.currentMoveIndex++;
    
    if (this.checkWinner()) {
      this.gameOver = true;
      this.updateStatus();
      return;
    }

    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    this.updateStatus();
    this.updateNavigationButtons();
  }

  findImmediateWin() {
    const targetRow = this.botColor === 'black' ? 7 : 0;
    const currentRow = this.botColor === 'black' ? 6 : 1;
    const direction = this.botColor === 'black' ? 1 : -1;

    for (let col = 0; col < 8; col++) {
      if (this.board[currentRow][col] === this.botColor) {
        // Check forward promotion
        if (!this.board[targetRow][col]) {
          return { fromRow: currentRow, fromCol: col, toRow: targetRow, toCol: col };
        }
        // Check capture promotions
        for (const colOffset of [-1, 1]) {
          const newCol = col + colOffset;
          if (newCol >= 0 && newCol < 8 && 
              this.board[targetRow][newCol] === (this.botColor === 'black' ? 'white' : 'black')) {
            return { fromRow: currentRow, fromCol: col, toRow: targetRow, toCol: newCol };
          }
        }
      }
    }
    return null;
  }

  async makeBotMove() {
    if (this.gameOver || this.currentPlayer !== this.botColor) return;

    document.body.classList.add('thinking');
    const thinkingBar = document.querySelector('.thinking-bar');
    thinkingBar.style.width = '0%';

    await new Promise(resolve => setTimeout(resolve, 100));
    thinkingBar.style.width = '20%';

    // Thinking time based on level
    const baseThinkTime = Math.max(500, this.botLevel * 200);
    await new Promise(resolve => setTimeout(resolve, baseThinkTime));

    let bestMove = null;
    let bestScore = -Infinity;

    // Search depth based on level
    const searchDepth = Math.floor(this.botLevel / 2);

    // First check for immediate winning moves
    const immediateWin = this.findImmediateWin();
    if (immediateWin) {
      bestMove = immediateWin;
    } else {
      thinkingBar.style.width = '40%';

      // Always look for captures first (higher levels are more aggressive)
      const captures = this.findAllCaptures();
      if (captures.length > 0) {
        if (this.botLevel >= 7) {
          // Evaluate each capture more carefully at higher levels
          for (const capture of captures) {
            const score = this.evaluatePosition(capture.fromRow, capture.fromCol, capture.toRow, capture.toCol, searchDepth);
            if (score > bestScore) {
              bestScore = score;
              bestMove = capture;
            }
          }
        } else {
          // Lower levels just take the first capture
          bestMove = captures[0];
        }
      }

      thinkingBar.style.width = '60%';

      // If no captures or at higher levels, look for positional play
      if (!bestMove || this.botLevel >= 8) {
        const moves = this.generateAllMoves();
        for (const move of moves) {
          const score = this.evaluatePosition(move.fromRow, move.fromCol, move.toRow, move.toCol, searchDepth);
          
          // Add randomness for lower levels
          const randomFactor = this.botLevel <= 4 ? (Math.random() - 0.5) * 1000 : 0;
          
          if (score + randomFactor > bestScore) {
            bestScore = score + randomFactor;
            bestMove = move;
          }
        }
      }
    }

    thinkingBar.style.width = '80%';
    await new Promise(resolve => setTimeout(resolve, baseThinkTime / 2));

    if (bestMove) {
      await this.makeMove(bestMove.fromRow, bestMove.fromCol, bestMove.toRow, bestMove.toCol);
    }

    thinkingBar.style.width = '100%';
    await new Promise(resolve => setTimeout(resolve, 100));
    document.body.classList.remove('thinking');
    thinkingBar.style.width = '0%';
  }

  evaluatePosition(fromRow, fromCol, toRow, toCol, depth) {
    let score = 0;

    // Base evaluation
    score += this.quickEvaluate(fromRow, fromCol, toRow, toCol);

    // Higher levels consider more factors
    if (this.botLevel >= 7) {
      // Pawn structure evaluation
      score += this.evaluatePawnStructure(toRow, toCol, this.botColor) * 200;
      
      // Control of key squares
      score += this.evaluateSquareControl(toRow, toCol) * 150;
      
      // Mobility bonus
      const mobilityScore = this.evaluateMobility(toRow, toCol) * 100;
      score += this.botLevel >= 9 ? mobilityScore * 2 : mobilityScore;
    }

    // Randomization for lower levels
    if (this.botLevel <= 4) {
      score += (Math.random() - 0.5) * (1000 / this.botLevel);
    }

    return score;
  }

  evaluateMobility(row, col) {
    let mobility = 0;
    const moves = this.findAllValidMoves(row, col);
    mobility += moves.length;

    // Higher levels consider future mobility
    if (this.botLevel >= 8) {
      for (const move of moves) {
        if (!this.isPawnEnPrise(move.toRow, move.toCol, this.botColor)) {
          mobility += 1;
        }
      }
    }

    return mobility;
  }

  findAllCaptures() {
    const captures = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.board[row][col] === this.botColor) {
          const pawnCaptures = this.findCaptureMoves(row, col);
          captures.push(...pawnCaptures);
        }
      }
    }
    return captures;
  }

  generateAllMoves() {
    const moves = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.board[row][col] === this.botColor) {
          const pawnMoves = this.findAllValidMoves(row, col);
          moves.push(...pawnMoves);
        }
      }
    }
    return moves;
  }

  findCaptureMoves(row, col) {
    const moves = [];
    const direction = this.botColor === 'black' ? 1 : -1;
    const enemyColor = this.botColor === 'black' ? 'white' : 'black';

    // Check diagonal captures
    for (const colOffset of [-1, 1]) {
      const newRow = row + direction;
      const newCol = col + colOffset;
      
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        if (this.board[newRow][newCol] === enemyColor || 
            this.isEnPassantCapture(row, col, newRow, newCol)) {
          moves.push({ fromRow: row, fromCol: col, toRow: newRow, toCol: newCol });
        }
      }
    }

    return moves;
  }

  findAllValidMoves(row, col) {
    const moves = [];
    const direction = this.botColor === 'black' ? 1 : -1;

    // Forward one
    if (this.isValidMove(row, col, row + direction, col)) {
      moves.push({ fromRow: row, fromCol: col, toRow: row + direction, toCol: col });
    }

    // Forward two (if applicable)
    if ((this.botColor === 'black' && row === 1) || (this.botColor === 'white' && row === 6)) {
      if (this.isValidMove(row, col, row + 2 * direction, col)) {
        moves.push({ fromRow: row, fromCol: col, toRow: row + 2 * direction, toCol: col });
      }
    }

    return moves;
  }

  quickEvaluate(fromRow, fromCol, toRow, toCol) {
    let score = 0;
    const enemyColor = this.botColor === 'black' ? 'white' : 'black';
    const direction = this.botColor === 'black' ? 1 : -1;

    // Immediate promotion is highest priority
    if ((this.botColor === 'black' && toRow === 7) || 
        (this.botColor === 'white' && toRow === 0)) {
      return 20000;
    }

    // Never move to a square where pawn can be captured without compensation
    if (this.isPawnEnPrise(toRow, toCol, this.botColor)) {
      const compensatingCapture = this.canCaptureAfterMove(toRow, toCol);
      if (!compensatingCapture) {
        return -20000;
      }
    }

    // Heavily prioritize advancement in endgame
    const totalPawns = this.countPawns();
    const isEndgame = totalPawns <= 8;
    
    if (isEndgame) {
      // More aggressive advancement in endgame
      const rankAdvancement = this.botColor === 'black' ? toRow : (7 - toRow);
      score += rankAdvancement * 300;
    } else {
      // Normal advancement score
      const rankAdvancement = this.botColor === 'black' ? toRow : (7 - toRow);
      score += rankAdvancement * 150;
    }

    // Strongly prioritize creating passed pawns
    if (this.isPassedPawn(toRow, toCol, this.botColor)) {
      score += 500;
      // Extra bonus for protected passed pawns
      if (this.isPawnProtected(toRow, toCol, this.botColor)) {
        score += 300;
      }
    }

    // Center control is more important in the opening/middlegame
    if (!isEndgame) {
      if (toCol >= 3 && toCol <= 4) score += 150;  // Central files
      else if (toCol >= 2 && toCol <= 5) score += 75;  // Semi-central files
    }

    // Protected pawns are very valuable
    if (this.isPawnProtected(toRow, toCol, this.botColor)) {
      score += 200;
    }

    // Connected pawns create strong pawn structure
    if (this.hasConnectedPawns(toRow, toCol, this.botColor)) {
      score += 150;
      // Extra bonus for connected pawns in center
      if (toCol >= 2 && toCol <= 5) {
        score += 100;
      }
    }

    // Bonus for moves that threaten enemy pawns
    if (this.canThreatenEnemyPawns(toRow, toCol, this.botColor)) {
      score += 250;
      // Extra bonus if the threatened pawn is unprotected
      const threatenedPositions = this.getThreatenedPositions(toRow, toCol);
      for (const pos of threatenedPositions) {
        if (!this.isPawnProtected(pos.row, pos.col, enemyColor)) {
          score += 200;
        }
      }
    }

    // Discourage moves that create isolated pawns
    if (this.wouldCreateIsolatedPawn(toRow, toCol, this.botColor)) {
      score -= 150;
    }

    // Bonus for moves that control key squares
    score += this.evaluateSquareControl(toRow, toCol) * 100;

    return score;
  }

  countPawns() {
    let count = 0;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.board[row][col]) count++;
      }
    }
    return count;
  }

  canCaptureAfterMove(row, col) {
    const direction = this.botColor === 'black' ? 1 : -1;
    for (const colOffset of [-1, 1]) {
      const newRow = row + direction;
      const newCol = col + colOffset;
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        if (this.board[newRow][newCol] === (this.botColor === 'black' ? 'white' : 'black')) {
          return true;
        }
      }
    }
    return false;
  }

  getThreatenedPositions(row, col) {
    const positions = [];
    const direction = this.botColor === 'black' ? 1 : -1;
    for (const colOffset of [-1, 1]) {
      const newRow = row + direction;
      const newCol = col + colOffset;
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        if (this.board[newRow][newCol] === (this.botColor === 'black' ? 'white' : 'black')) {
          positions.push({ row: newRow, col: newCol });
        }
      }
    }
    return positions;
  }

  wouldCreateIsolatedPawn(row, col, piece) {
    // Check if there are any friendly pawns in adjacent files
    for (let r = 0; r < 8; r++) {
      if (col > 0 && this.board[r][col - 1] === piece) return false;
      if (col < 7 && this.board[r][col + 1] === piece) return false;
    }
    return true;
  }

  evaluateSquareControl(row, col) {
    let score = 0;
    const isEndgame = this.countPawns() <= 8;
    
    // Control of central squares is more important
    if (col >= 3 && col <= 4) {
      if (row >= 3 && row <= 4) score += 3;  // Central squares
      else score += 2;  // Central files
    }
    
    // In endgame, control of promotion squares is crucial
    if (isEndgame) {
      const distanceToPromotion = this.botColor === 'black' ? (7 - row) : row;
      score += (8 - distanceToPromotion) * 2;
    }
    
    return score;
  }

  isPawnEnPrise(row, col, piece) {
    const enemyColor = piece === 'black' ? 'white' : 'black';
    const enemyDirection = piece === 'black' ? -1 : 1;

    // Check if enemy pawns can capture our pawn
    if (row + enemyDirection >= 0 && row + enemyDirection < 8) {
      for (const colOffset of [-1, 1]) {
        const attackCol = col + colOffset;
        if (attackCol >= 0 && attackCol < 8) {
          if (this.board[row + enemyDirection][attackCol] === enemyColor) {
            // Check if the enemy pawn is protected
            if (!this.isPawnProtected(row, col, piece)) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  canThreatenEnemyPawns(row, col, piece) {
    const direction = piece === 'black' ? 1 : -1;
    const enemyColor = piece === 'black' ? 'white' : 'black';
    
    // Check diagonal captures
    for (const colOffset of [-1, 1]) {
      const targetRow = row + direction;
      const targetCol = col + colOffset;
      if (targetRow >= 0 && targetRow < 8 && targetCol >= 0 && targetCol < 8) {
        if (this.board[targetRow][targetCol] === enemyColor) {
          return true;
        }
      }
    }
    return false;
  }

  evaluatePawnStructure(row, col, piece) {
    let score = 0;
    const direction = piece === this.botColor ? 1 : -1;

    // Protected pawns
    if (this.isPawnProtected(row, col, piece)) {
      score += 2;
    }

    // Connected pawns (pawns side by side)
    if (this.hasConnectedPawns(row, col, piece)) {
      score += 1;
    }

    // Passed pawns (no enemy pawns ahead)
    if (this.isPassedPawn(row, col, piece)) {
      score += 3;
    }

    return score;
  }

  isPawnProtected(row, col, piece) {
    const backRow = row - (piece === this.botColor ? 1 : -1);
    if (backRow >= 0 && backRow < 8) {
      return (col > 0 && this.board[backRow][col - 1] === piece) ||
             (col < 7 && this.board[backRow][col + 1] === piece);
    }
    return false;
  }

  hasConnectedPawns(row, col, piece) {
    return (col > 0 && this.board[row][col - 1] === piece) ||
           (col < 7 && this.board[row][col + 1] === piece);
  }

  isPassedPawn(row, col, piece) {
    const direction = piece === this.botColor ? 1 : -1;
    const enemyPiece = piece === 'white' ? 'black' : 'white';
    let passed = true;

    // Check if there are any enemy pawns that could stop this pawn
    for (let r = row; r >= 0 && r < 8; r += direction) {
      for (let c = Math.max(0, col - 1); c <= Math.min(7, col + 1); c++) {
        if (this.board[r][c] === enemyPiece) {
          passed = false;
          break;
        }
      }
      if (!passed) break;
    }
    return passed;
  }

  rewindMove() {
    if (this.currentMoveIndex < 0) return;
    
    const move = this.moveHistory[this.currentMoveIndex];
    
    // Undo the move
    this.board[move.fromRow][move.fromCol] = this.board[move.toRow][move.toCol];
    this.board[move.toRow][move.toCol] = null;
    
    // Restore captured pawn if there was one
    if (move.capturedPawn) {
      this.board[move.capturedPawn.row][move.capturedPawn.col] = move.capturedPawn.type;
    }
    
    // Restore last double move state
    this.lastDoubleMoveColumn = move.lastDoubleMoveColumn;
    this.lastDoubleMoveRow = move.lastDoubleMoveRow;
    
    this.currentMoveIndex--;
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    this.gameOver = false;
    this.winner = null;
    
    this.createBoard();
    this.updateStatus();
    this.updateNavigationButtons();
  }

  forwardMove() {
    if (this.currentMoveIndex >= this.moveHistory.length - 1) return;
    
    const move = this.moveHistory[this.currentMoveIndex + 1];
    
    // Replay the move
    if (move.capturedPawn) {
      this.board[move.capturedPawn.row][move.capturedPawn.col] = null;
    }
    
    this.board[move.toRow][move.toCol] = this.board[move.fromRow][move.fromCol];
    this.board[move.fromRow][move.fromCol] = null;
    
    // Update last double move state
    this.lastDoubleMoveColumn = move.isDoubleMove ? move.toCol : null;
    this.lastDoubleMoveRow = move.isDoubleMove ? move.toRow : null;
    
    this.currentMoveIndex++;
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    
    // Check if this move resulted in a win
    if (this.checkWinner()) {
      this.gameOver = true;
    }
    
    this.createBoard();
    this.updateStatus();
    this.updateNavigationButtons();
  }

  isEnPassantCapture(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol];
    const direction = piece === 'white' ? -1 : 1;

    // Check if the move is to the side and forward
    if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction) {
      // Check if there's a pawn that just made a double move next to us
      if (toCol === this.lastDoubleMoveColumn && 
          fromRow === this.lastDoubleMoveRow && 
          this.board[fromRow][toCol] === (piece === 'white' ? 'black' : 'white')) {
        return true;
      }
    }
    return false;
  }

  isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol];
    const direction = piece === 'white' ? -1 : 1;
    
    // Normal move (one square forward)
    if (fromCol === toCol && toRow === fromRow + direction && !this.board[toRow][toCol]) {
      return true;
    }
    
    // Initial two-square move
    if (fromCol === toCol && 
        ((piece === 'white' && fromRow === 6 && toRow === 4) || 
         (piece === 'black' && fromRow === 1 && toRow === 3)) &&
        !this.board[fromRow + direction][toCol] &&
        !this.board[toRow][toCol]) {
      return true;
    }
    
    // Regular capture move
    if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction) {
      // Check for normal capture or en passant
      return this.board[toRow][toCol] === (piece === 'white' ? 'black' : 'white') ||
             this.isEnPassantCapture(fromRow, fromCol, toRow, toCol);
    }
    
    return false;
  }

  movePawn(fromRow, fromCol, toRow, toCol) {
    this.board[toRow][toCol] = this.board[fromRow][fromCol];
    this.board[fromRow][fromCol] = null;
    this.createBoard();
  }

  highlightSquare(row, col) {
    const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    square.classList.add('highlight');
  }

  showValidMoves(row, col) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.isValidMove(row, col, i, j)) {
          const square = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
          square.classList.add('valid-move');
        }
      }
    }
  }

  removeHighlights() {
    document.querySelectorAll('.square').forEach(square => {
      square.classList.remove('highlight', 'valid-move');
    });
  }

  checkWinner() {
    // Check if any pawn reached the opposite end
    for (let col = 0; col < 8; col++) {
      if (this.board[0][col] === 'white') {
        this.winner = 'white';
        return true;
      }
      if (this.board[7][col] === 'black') {
        this.winner = 'black';
        return true;
      }
    }
    return false;
  }

  updateStatus() {
    const status = document.getElementById('game-status');
    if (this.gameOver) {
      status.textContent = `Game Over! ${this.winner.charAt(0).toUpperCase() + this.winner.slice(1)} wins!`;
    } else {
      let statusText = `Current turn: ${this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1)}`;
      if (this.gameMode === 'multiplayer') {
        statusText += ` (You are ${this.multiplayer.playerColor})`;
      }
      status.textContent = statusText;
    }
  }

  updateNavigationButtons() {
    const rewindBtn = document.getElementById('rewind-btn');
    const forwardBtn = document.getElementById('forward-btn');
    
    rewindBtn.disabled = this.currentMoveIndex < 0;
    forwardBtn.disabled = this.currentMoveIndex >= this.moveHistory.length - 1;
  }

  async restart() {
    this.board = Array(8).fill().map(() => Array(8).fill(null));
    this.currentPlayer = 'white';
    this.selectedPawn = null;
    this.gameOver = false;
    this.winner = null;
    this.lastDoubleMoveColumn = null;
    this.lastDoubleMoveRow = null;
    this.moveHistory = [];
    this.currentMoveIndex = -1;
    this.init();
    
    if (this.gameMode === 'multiplayer') {
      this.multiplayer.sendRestart();
    }
    
    if (this.botMode && this.currentPlayer === this.botColor) {
      await this.bot.makeBotMove();
    }
  }
}

// Initialize game
const game = new PawnGame();