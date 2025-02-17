// Connect to the game server
const socket = io();

let isMyTurn = false;
const gameBoard = document.getElementById('game-board');
const gameStatus = document.getElementById('game-status');
const playerInfo = document.getElementById('player-info');
const resetButton = document.getElementById('reset-game');


gameBoard.addEventListener('click', (event) => {
    //check if click is valid and in the game board
    if (!event.target.dataset.index) return;
    if (!isMyTurn) return;
    if (event.target.style.backgroundColor) return;
    
    // If we get here, it's a valid move, so set the color 
    // red for first player
    event.target.style.backgroundColor = '#FF5722';
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
    //blue for opponent
    cell.style.backgroundColor = '#2196F3';  
    isMyTurn = true;
    updateGameStatus();
});

// winner
socket.on('game-won', ({ winner }) => {
    if (winner === 'player1') {
        if (isMyTurn) {
            gameStatus.textContent = 'You won!';
        } else {
            gameStatus.textContent = 'Opponent won!';
        }
    } else {
        if (isMyTurn) {
            gameStatus.textContent = 'Opponent won!';
        } else {
            gameStatus.textContent = 'You won!';
        }
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