// Connect to the game server
const socket = io();

let isMyTurn = false;
let isPlayer1 = false;  // To track if we're player 1 or 2
const RED = '#FF5722';
const BLUE = '#2196F3';

const gameBoard = document.getElementById('game-board');
const gameStatus = document.getElementById('game-status');
const playerInfo = document.getElementById('player-info');
const resetButton = document.getElementById('reset-game');

gameBoard.addEventListener('click', (event) => {
    if (!event.target.dataset.index) return;
    if (!isMyTurn) return;
    if (event.target.style.backgroundColor) return;
    
    // Player 1 is always red, Player 2 is always blue
    if (isPlayer1) {
        event.target.style.backgroundColor = RED;
    } else {
        event.target.style.backgroundColor = BLUE;
    }
    socket.emit('move', { index: event.target.dataset.index });
    isMyTurn = false;
    updateGameStatus();
});

resetButton.addEventListener('click', () => {
    socket.emit('request-reset');
});

// Update players game status 
function updateGameStatus() {
    if (isMyTurn) {
        gameStatus.textContent = "It's your turn!";
    } else {
        gameStatus.textContent = "Waiting for opponent...";
    }
}

// assign players as 1 or 2
socket.on('player-assigned', ({ start }) => {
    isMyTurn = start;
    isPlayer1 = start;  // First player (start=true) is Player 1
    if (start) {
        playerInfo.textContent = 'You are Player 1 (Red)';
    } else {
        playerInfo.textContent = 'You are Player 2 (Blue)';
    }
    updateGameStatus();
});

// When opponent moves
socket.on('opponent-move', ({ index }) => {
    const cell = gameBoard.children[index];
    // If I'm Player 1, opponent is blue; if I'm Player 2, opponent is red
    if (isPlayer1) {
        cell.style.backgroundColor = BLUE;
    } else {
        cell.style.backgroundColor = RED;
    }
    isMyTurn = true;
    updateGameStatus();
});

// winner logic
socket.on('game-won', ({ winner }) => {
    if ((winner === 'player1' && playerInfo.textContent.includes('Red')) ||
        (winner === 'player2' && playerInfo.textContent.includes('Blue'))) {
        gameStatus.textContent = 'You won! ';
    } else {
        gameStatus.textContent = 'Opponent won!';
    }
    isMyTurn = false;
});

// Tie
socket.on('game-draw', () => {
    gameStatus.textContent = "It's a tie!";
    isMyTurn = false;
});

// When someone disconnects
socket.on('opponent-disconnected', () => {
    playerInfo.textContent = 'Opponent left. Waiting for new player...';
    gameStatus.textContent = '';
    for (let button of gameBoard.children) {
        button.style.backgroundColor = '';
    }
});

//reset the game
socket.on('game-reset', () => {
    for (let button of gameBoard.children) {
        button.style.backgroundColor = '';
    }
    resetButton.style.display = 'none';
    updateGameStatus();
}); 