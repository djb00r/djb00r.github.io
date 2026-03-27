class ChessBot {
  constructor(game) {
    this.game = game;
    this.maxDepth = 8; // Maximum search depth
    this.positionsEvaluated = 0;
    this.moveCache = new Map(); // Cache for move evaluations
  }

  async makeBotMove() {
    if (this.game.gameOver || this.game.currentPlayer !== this.game.botColor) return;

    // Start thinking animation
    document.body.classList.add('thinking');
    const thinkingBar = document.querySelector('.thinking-bar');
    thinkingBar.style.width = '0%';

    await new Promise(resolve => setTimeout(resolve, 100));
    thinkingBar.style.width = '20%';

    // Thinking time based on level
    const baseThinkTime = Math.max(300, this.game.botLevel * 100);
    await new Promise(resolve => setTimeout(resolve, baseThinkTime / 2));

    const move = await this.findBestMove();
    
    thinkingBar.style.width = '80%';
    await new Promise(resolve => setTimeout(resolve, baseThinkTime / 4));

    if (move) {
      await this.game.makeMove(move.fromRow, move.fromCol, move.toRow, move.toCol);
    }

    thinkingBar.style.width = '100%';
    await new Promise(resolve => setTimeout(resolve, 100));
    document.body.classList.remove('thinking');
    thinkingBar.style.width = '0%';
  }

  async findBestMove() {
    this.positionsEvaluated = 0;
    const startTime = Date.now();
    
    // First check for immediate winning moves
    const winningMove = this.findWinningMove();
    if (winningMove) return winningMove;

    // Then check for forced captures
    const captures = this.findForcedCaptures();
    if (captures.length > 0) {
      return this.evaluateCaptureSequences(captures);
    }

    // If no immediate winning moves or forced captures, do full search
    const depth = Math.min(this.maxDepth, Math.floor(this.game.botLevel / 2) + 3);
    const { move } = await this.minimax(depth, -Infinity, Infinity, true);
    
    console.log(`Evaluated ${this.positionsEvaluated} positions in ${Date.now() - startTime}ms`);
    return move;
  }

  findWinningMove() {
    const promotionRow = this.game.botColor === 'black' ? 7 : 0;
    for (const move of this.generateAllMoves()) {
      if (move.toRow === promotionRow && !this.isSquareAttacked(move.toRow, move.toCol)) {
        return move;
      }
    }
    return null;
  }

  findForcedCaptures() {
    return this.generateAllMoves().filter(move => {
      const targetPiece = this.game.board[move.toRow][move.toCol];
      return targetPiece && targetPiece !== this.game.botColor && 
             !this.isSquareAttacked(move.toRow, move.toCol);
    });
  }

  evaluateCaptureSequences(captures) {
    let bestMove = captures[0];
    let bestScore = -Infinity;

    for (const move of captures) {
      const score = this.evaluatePosition(move, 2);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  async minimax(depth, alpha, beta, isMaximizing) {
    this.positionsEvaluated++;

    if (depth === 0) {
      return { score: this.evaluatePosition() };
    }

    const moves = this.generateAllMoves();
    if (moves.length === 0) {
      return { score: isMaximizing ? -Infinity : Infinity };
    }

    let bestMove = moves[0];
    let bestScore = isMaximizing ? -Infinity : Infinity;

    for (const move of moves) {
      // Make move
      const savedState = this.saveGameState();
      this.makeTemporaryMove(move);

      // Recursively evaluate position
      const evaluation = await this.minimax(depth - 1, alpha, beta, !isMaximizing);
      const score = evaluation.score;

      // Unmake move
      this.restoreGameState(savedState);

      // Update best score and move
      if (isMaximizing) {
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
        alpha = Math.max(alpha, score);
      } else {
        if (score < bestScore) {
          bestScore = score;
          bestMove = move;
        }
        beta = Math.min(beta, score);
      }

      if (beta <= alpha) break;
    }

    return { move: bestMove, score: bestScore };
  }

  generateAllMoves() {
    const moves = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.game.board[row][col] === this.game.botColor) {
          this.addValidMovesForPawn(moves, row, col);
        }
      }
    }
    return moves;
  }

  addValidMovesForPawn(moves, row, col) {
    const direction = this.game.botColor === 'black' ? 1 : -1;
    
    // Forward moves
    if (this.isValidSquare(row + direction, col) && !this.game.board[row + direction][col]) {
      moves.push({ fromRow: row, fromCol: col, toRow: row + direction, toCol: col });
      
      // Double move from starting position
      if ((this.game.botColor === 'black' && row === 1) || 
          (this.game.botColor === 'white' && row === 6)) {
        if (!this.game.board[row + direction][col] && 
            !this.game.board[row + 2 * direction][col]) {
          moves.push({ fromRow: row, fromCol: col, toRow: row + 2 * direction, toCol: col });
        }
      }
    }

    // Captures
    for (const colOffset of [-1, 1]) {
      const newCol = col + colOffset;
      if (this.isValidSquare(row + direction, newCol)) {
        if (this.canCapture(row, col, row + direction, newCol)) {
          moves.push({ fromRow: row, fromCol: col, toRow: row + direction, toCol: newCol });
        }
      }
    }
  }

  isValidSquare(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  canCapture(fromRow, fromCol, toRow, toCol) {
    const targetPiece = this.game.board[toRow][toCol];
    return targetPiece && targetPiece !== this.game.botColor;
  }

  isSquareAttacked(row, col) {
    const attackerColor = this.game.botColor === 'white' ? 'black' : 'white';
    const direction = attackerColor === 'black' ? -1 : 1;

    // Check diagonally backward for attacking pawns
    for (const colOffset of [-1, 1]) {
      const attackerRow = row - direction;
      const attackerCol = col + colOffset;
      if (this.isValidSquare(attackerRow, attackerCol) && 
          this.game.board[attackerRow][attackerCol] === attackerColor) {
        return true;
      }
    }
    return false;
  }

  evaluatePosition(move = null, depth = 0) {
    let score = 0;
    const cacheKey = this.getBoardHash();

    if (this.moveCache.has(cacheKey)) {
      return this.moveCache.get(cacheKey);
    }

    // Material count and positional evaluation
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.game.board[row][col];
        if (!piece) continue;

        const isBot = piece === this.game.botColor;
        const baseValue = isBot ? 100 : -100;
        
        // Position-based evaluation
        score += this.evaluateSquare(row, col, isBot);
        
        // Pawn structure evaluation
        score += this.evaluatePawnStructure(row, col, isBot);
        
        // Material value
        score += baseValue;
      }
    }

    // Mobility evaluation
    score += this.evaluateMobility() * (this.game.botLevel >= 7 ? 30 : 15);

    // King safety (distance to promotion)
    score += this.evaluateKingSafety() * (this.game.botLevel >= 8 ? 50 : 25);

    // Randomization for lower levels
    if (this.game.botLevel <= 4) {
      score += (Math.random() - 0.5) * (1000 / this.game.botLevel);
    }

    this.moveCache.set(cacheKey, score);
    return score;
  }

  evaluateSquare(row, col, isBot) {
    let score = 0;
    const promotionRow = isBot ? (this.game.botColor === 'black' ? 7 : 0) : 
                                (this.game.botColor === 'black' ? 0 : 7);

    // Distance to promotion
    const distanceToPromotion = Math.abs(row - promotionRow);
    score += isBot ? (7 - distanceToPromotion) * 20 : distanceToPromotion * 20;

    // Center control
    const centerDistance = Math.abs(3.5 - col);
    score += isBot ? (3.5 - centerDistance) * 10 : centerDistance * 10;

    return score;
  }

  evaluatePawnStructure(row, col, isBot) {
    let score = 0;
    const piece = this.game.board[row][col];
    if (!piece) return 0;

    // Protected pawns
    if (this.isPawnProtected(row, col, piece)) {
      score += isBot ? 30 : -30;
    }

    // Connected pawns
    if (this.hasConnectedPawns(row, col, piece)) {
      score += isBot ? 25 : -25;
    }

    // Isolated pawns
    if (this.isIsolatedPawn(row, col, piece)) {
      score += isBot ? -20 : 20;
    }

    // Doubled pawns
    if (this.isDoubledPawn(row, col, piece)) {
      score += isBot ? -15 : 15;
    }

    return score;
  }

  evaluateMobility() {
    const moves = this.generateAllMoves();
    return moves.length * 10;
  }

  evaluateKingSafety() {
    let score = 0;
    const promotionRow = this.game.botColor === 'black' ? 7 : 0;

    for (let col = 0; col < 8; col++) {
      if (this.game.board[promotionRow][col] === this.game.botColor) {
        score += 500;
      }
    }

    return score;
  }

  isPawnProtected(row, col, piece) {
    const direction = piece === this.game.botColor ? -1 : 1;
    for (const colOffset of [-1, 1]) {
      const protectorCol = col + colOffset;
      if (this.isValidSquare(row + direction, protectorCol) && 
          this.game.board[row + direction][protectorCol] === piece) {
        return true;
      }
    }
    return false;
  }

  hasConnectedPawns(row, col, piece) {
    for (const colOffset of [-1, 1]) {
      const neighborCol = col + colOffset;
      if (this.isValidSquare(row, neighborCol) && 
          this.game.board[row][neighborCol] === piece) {
        return true;
      }
    }
    return false;
  }

  isIsolatedPawn(row, col, piece) {
    for (let r = 0; r < 8; r++) {
      for (const colOffset of [-1, 1]) {
        const neighborCol = col + colOffset;
        if (this.isValidSquare(r, neighborCol) && 
            this.game.board[r][neighborCol] === piece) {
          return false;
        }
      }
    }
    return true;
  }

  isDoubledPawn(row, col, piece) {
    for (let r = 0; r < 8; r++) {
      if (r !== row && this.game.board[r][col] === piece) {
        return true;
      }
    }
    return false;
  }

  getBoardHash() {
    return this.game.board.map(row => row.join('')).join('');
  }

  saveGameState() {
    return {
      board: this.game.board.map(row => [...row]),
      currentPlayer: this.game.currentPlayer,
      lastDoubleMoveColumn: this.game.lastDoubleMoveColumn,
      lastDoubleMoveRow: this.game.lastDoubleMoveRow
    };
  }

  restoreGameState(state) {
    this.game.board = state.board.map(row => [...row]);
    this.game.currentPlayer = state.currentPlayer;
    this.game.lastDoubleMoveColumn = state.lastDoubleMoveColumn;
    this.game.lastDoubleMoveRow = state.lastDoubleMoveRow;
  }

  makeTemporaryMove(move) {
    const {fromRow, fromCol, toRow, toCol} = move;
    this.game.board[toRow][toCol] = this.game.board[fromRow][fromCol];
    this.game.board[fromRow][fromCol] = null;
    this.game.currentPlayer = this.game.currentPlayer === 'white' ? 'black' : 'white';
  }
}