// This is the server code and it is deliberately very simple. You could


// We're using two libraries. 
// "Express" makes it easy to serve web pages
const express = require("express");
// ...and socket.io is a wrapper around Websockets, 
// so we can exchange messages in real time with a client-side application
const socketIO = require("socket.io");

// Express needs to know what port to listen to. Because we're using Glitch, 
// the specific port might be chosen for us (dynamically allocated); 
// if that happens, Glitch will put the one we should use in the "environmental 
// variable" called process.env.PORT. If nothing is there (or, for example, 
// you run on your own computer), the "||" will mean it resolves to 3000 instead.
const PORT = process.env.PORT || 3000;

// Initiate an Express server
const server = express()
	.use(express.static('public'))
	.listen(PORT, () => console.log(`Listening on ${PORT}`));


const io = socketIO(server);
io.on("connection", function(socket) {
	socket.on("disconnect", function() {
	});
	socket.on("message", function(msg) { // leaving this in case I want to use it for other messages
	    console.log(msg);
	});
	socket.on("paint", function(data){
		console.log(data);
		socket.broadcast.emit("paint", data); // "broadcast" flag means "emit to everyone *else*"
	});
});