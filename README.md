This is a simple framework for making "chat"-type websites. Most of the code lives in "front-end" html/css files in the "public" folder, and there's a small server (server.js) that coordinates sending messages between client front-ends.

The simplest version is in the "public/simpleclick" folder.

You can develop/run your code directly here on Glitch: when you edit the code, it should automatically update the live version.

Alternatively, you may prefer to run locally (on your computer), to use your favorite programming environment. To do so:
1) Download these files. See https://help.glitch.com/hc/en-us/articles/16287559678733-Downloading-Projects for instructions. (Or follow https://help.glitch.com/hc/en-us/articles/16287554099213-Pushing-Local-Code-to-a-Project to use git to sync.)
2) Make sure you have Node and npm installed on your computer.
3) Navigate to the directory with these files.
4) Run `npm install` to install the dependencies (Express and socket.io).
5) Run `node server.js` to start the server.
6) Open a browser and go to http://localhost:3000/[whichever]