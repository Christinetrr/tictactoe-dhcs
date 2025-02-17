// This is the server code. Its job is to serve static web pages, 
// and to receive and transmit websocket messages. As it is currently configured:
// when it gets any incoming message from one client, it broadcasts that message
// back to everyone else.

// --- code by Lea for Spring 2025 Designing Human Centered Software at CMU ---

// We're using two libraries. 
// "Express" makes it easy to serve web pages
const express = require("express");
// ...and socket.io is a wrapper around Websockets, 
// so we can exchange messages in real time with a client-side application
const socketIO = require("socket.io");
const app = express();
const http = require('http').createServer(app);

// Express needs to know what port to listen to. Because we're using Glitch, 
// the specific port might be chosen for us (dynamically allocated); 
// if that happens, Glitch will put the one we should use in the "environmental 
// variable" called process.env.PORT. If nothing is there (or, for example, 
// you run on your own computer), the "||" will mean it resolves to 3000 instead.
const PORT = process.env.PORT || 3000;

// Serve our web files from the 'public' folder
app.use(express.static('public'));

// Keep track of players waiting and current games
let waitingPlayer = null;

// Store games
let games = new Map(); 

// Initiate a socket listener.
//const io = socketIO(http);
const io = socketIO(http, {
	pingTimeout: 60000,  // How long to wait for ping response
	pingInterval: 25000  // How often to ping
});

// Whenever the socket gets a new client connection, register the following event handlers...
io.on('connection', (socket) => {
	if (!waitingPlayer) {
		waitingPlayer = socket;
		socket.emit('player-assigned', { start: true });
	} 
	else {
		let game = {
			board: ['', '', '', '', '', '', '', '', ''],
			player1: waitingPlayer,
			player2: socket
		};
		
		socket.opponent = waitingPlayer;
		waitingPlayer.opponent = socket;
		
		games.set(socket, game);
		games.set(waitingPlayer, game);
		
		socket.emit('player-assigned', { start: false });
		waitingPlayer = null;
	}

	//Player move
	socket.on('move', ({ index }) => {
		const game = games.get(socket);
		if (!game) return;

		// Mark the board with which player moved
		if (game.player1 === socket) {
			game.board[index] = 'player1';
		} else {
			game.board[index] = 'player2';
		}
		
		socket.opponent.emit('opponent-move', { index });
		checkWinner(game);
	});
	//When a player disconnects
	socket.on('disconnect', () => {
		if (waitingPlayer === socket) {
			waitingPlayer = null;
			return;
		}
		//tells player opponent left
		if (socket.opponent) {
			socket.opponent.emit('opponent-disconnected');
			games.delete(socket.opponent);
			games.delete(socket);
		}
	});
});

function checkWinner(game) {
	const wins = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
	
	for (let [a, b, c] of wins) {
		if (game.board[a] && game.board[a] === game.board[b] && game.board[a] === game.board[c]) {
			let lastPlayer = game.board[a];
			
			// Send the winner to both players
			game.player1.emit('game-won', { winner: lastPlayer });
			game.player2.emit('game-won', { winner: lastPlayer });
			return;
		}
	}

	if (!game.board.includes('')) {
		game.player1.emit('game-draw');
		game.player2.emit('game-draw');
	}
}

// Start the server
http.listen(PORT, () => {
	console.log(`Game server started on port ${PORT}`);
});
