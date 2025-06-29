const ticTacToeBtn = document.getElementById('ticTacToeBtn');
const spsBtn = document.getElementById('spsBtn');
const gameArea = document.getElementById('gameArea');
const scoreBoard = document.getElementById('scoreBoard');
const userPointsSpan = document.getElementById('userPoints');
const aiPointsSpan = document.getElementById('aiPoints');
const backBtn = document.getElementById('backBtn');
const gameSelection = document.querySelector('.game-selection');

let userPoints = 0;
let aiPoints = 0;
let currentGame = '';

function showScore() {
  userPointsSpan.textContent = `You: ${userPoints}`;
  aiPointsSpan.textContent = `Computer: ${aiPoints}`;
}

function resetScore() {
  userPoints = 0;
  aiPoints = 0;
  showScore();
}

function showGameArea() {
  gameSelection.classList.add('hidden');
  gameArea.classList.remove('hidden');
  scoreBoard.classList.remove('hidden');
  backBtn.classList.remove('hidden');
}

function showSelection() {
  gameSelection.classList.remove('hidden');
  gameArea.classList.add('hidden');
  scoreBoard.classList.add('hidden');
  backBtn.classList.add('hidden');
  gameArea.innerHTML = '';
  resetScore();
}

backBtn.onclick = showSelection;

ticTacToeBtn.onclick = () => {
  currentGame = 'ttt';
  showGameArea();
  startTicTacToe();
};

spsBtn.onclick = () => {
  currentGame = 'sps';
  showGameArea();
  startSPS();
};

// --- Tic Tac Toe ---
function startTicTacToe() {
  let board = Array(9).fill('');
  let userTurn = true;
  let gameOver = false;
  gameArea.innerHTML = `
    <div class="tic-tac-toe-status"></div>
    <div class="tic-tac-toe-board"></div>
  `;
  const statusDiv = gameArea.querySelector('.tic-tac-toe-status');
  const boardDiv = gameArea.querySelector('.tic-tac-toe-board');

  function render() {
    boardDiv.innerHTML = '';
    board.forEach((cell, i) => {
      const cellDiv = document.createElement('div');
      cellDiv.className = 'ttt-cell';
      cellDiv.textContent = cell;
      cellDiv.onclick = () => {
        if (!gameOver && userTurn && !cell) {
          board[i] = 'X';
          userTurn = false;
          checkGame();
          if (!gameOver) setTimeout(aiMove, 400);
        }
      };
      boardDiv.appendChild(cellDiv);
    });
    statusDiv.textContent = gameOver ? '' : (userTurn ? 'Your turn (X)' : "Computer's turn (O)");
  }

  function aiMove() {
    // 50% win probability for user: AI plays randomly, but blocks win or takes win if possible
    let empty = board.map((v, i) => v ? null : i).filter(v => v !== null);
    // Try to win
    for (let i of empty) {
      board[i] = 'O';
      if (checkWinner(board) === 'O') {
        userTurn = true;
        checkGame();
        render();
        return;
      }
      board[i] = '';
    }
    // Try to block
    for (let i of empty) {
      board[i] = 'X';
      if (checkWinner(board) === 'X') {
        board[i] = 'O';
        userTurn = true;
        checkGame();
        render();
        return;
      }
      board[i] = '';
    }
    // Otherwise random
    let move = empty[Math.floor(Math.random() * empty.length)];
    board[move] = 'O';
    userTurn = true;
    checkGame();
    render();
  }

  function checkGame() {
    let winner = checkWinner(board);
    if (winner) {
      gameOver = true;
      if (winner === 'X') {
        statusDiv.textContent = 'You win!';
        statusDiv.classList.add('bounce');
        setTimeout(() => statusDiv.classList.remove('bounce'), 700);
        userPoints++;
      } else {
        statusDiv.textContent = 'Computer wins!';
        statusDiv.classList.add('bounce');
        setTimeout(() => statusDiv.classList.remove('bounce'), 700);
        aiPoints++;
      }
      showScore();
      setTimeout(startTicTacToe, 1200);
    } else if (board.every(cell => cell)) {
      gameOver = true;
      statusDiv.textContent = "It's a draw!";
      statusDiv.classList.add('bounce');
      setTimeout(() => statusDiv.classList.remove('bounce'), 700);
      setTimeout(startTicTacToe, 1200);
    }
  }

  function checkWinner(b) {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let [a,b1,c] of lines) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }
    return null;
  }

  render();
}

// --- Stone Paper Scissors ---
function startSPS() {
  gameArea.innerHTML = `
    <div class="sps-status"></div>
    <div class="sps-options">
      <button class="sps-btn" data-move="stone">🪨 Stone</button>
      <button class="sps-btn" data-move="paper">📄 Paper</button>
      <button class="sps-btn" data-move="scissors">✂️ Scissors</button>
    </div>
    <div class="sps-result"></div>
  `;
  const statusDiv = gameArea.querySelector('.sps-status');
  const resultDiv = gameArea.querySelector('.sps-result');
  const btns = gameArea.querySelectorAll('.sps-btn');

  btns.forEach(btn => {
    btn.onclick = () => {
      const userMove = btn.getAttribute('data-move');
      const moves = ['stone', 'paper', 'scissors'];
      // 50% win probability for user
      let outcome = Math.random();
      let aiMove;
      if (outcome < 0.5) {
        // User wins
        if (userMove === 'stone') aiMove = 'scissors';
        if (userMove === 'paper') aiMove = 'stone';
        if (userMove === 'scissors') aiMove = 'paper';
      } else if (outcome < 0.75) {
        // Draw
        aiMove = userMove;
      } else {
        // AI wins
        if (userMove === 'stone') aiMove = 'paper';
        if (userMove === 'paper') aiMove = 'scissors';
        if (userMove === 'scissors') aiMove = 'stone';
      }
      let result;
      if (userMove === aiMove) {
        result = "It's a draw!";
      } else if (
        (userMove === 'stone' && aiMove === 'scissors') ||
        (userMove === 'paper' && aiMove === 'stone') ||
        (userMove === 'scissors' && aiMove === 'paper')
      ) {
        result = 'You win!';
        userPoints++;
      } else {
        result = 'Computer wins!';
        aiPoints++;
      }
      statusDiv.textContent = `You: ${capitalize(userMove)} | Computer: ${capitalize(aiMove)}`;
      resultDiv.textContent = result;
      resultDiv.classList.add('bounce');
      setTimeout(() => resultDiv.classList.remove('bounce'), 700);
      showScore();
      setTimeout(() => {
        statusDiv.textContent = '';
        resultDiv.textContent = '';
      }, 1200);
    };
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Start with selection
showSelection(); 