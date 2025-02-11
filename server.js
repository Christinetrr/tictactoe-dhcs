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

// Express needs to know what port to listen to. Because we're using Glitch, 
// the specific port might be chosen for us (dynamically allocated); 
// if that happens, Glitch will put the one we should use in the "environmental 
// variable" called process.env.PORT. If nothing is there (or, for example, 
// you run on your own computer), the "||" will mean it resolves to 3000 instead.
const PORT = process.env.PORT || 3000;

// Initiate an Express server. Tell it to serve the contents of the "public"
// folder as static files, and listen on the port we set above.
const server = express()
	.use(express.static('public'))
	.listen(PORT, () => console.log(`Listening on ${PORT}`));

// Initiate a socket listener.
const io = socketIO(server);

// Whenever the socket gets a new client connection, register the following event handlers...
io.on("connection", function(socket) {
  
  //   handle a "disconnect" event
  socket.on("disconnect", function() {
    //     nothing here for now
  }); 
  
  //   handle a "note" event
	socket.on("note", function(msg) { 
      //  log it to the server logs
	    console.log(msg);
    
      //  "emit" means to send back to the same client that sent this message we just got
      socket.emit("ok");
	});
  
  //   handle a "paint" event
	socket.on("paint", function(data){
    //  log it to the server logs
		console.log(data);
    // "broadcast" it: emit the "paint" message to everyone *except* who it came from
		socket.broadcast.emit("paint", data); 
	});

	// handle *any* event
	socket.onAny(function (eventName, args) {
		socket.broadcast.emit(eventName, args); 
	}) 
});
