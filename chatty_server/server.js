// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const uuid = require('node-uuid');
const WebSocket = require('ws');
// Set the port to 3001
const PORT = 3001;

const clients = [];


// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

function updateOnlineUsers() {
  let clientCount = wss.clients.size;
  let clientString = `${clientCount} user${clientCount === 1 ? "" : "s"} online`;

  broadcast({
    type: "connections",
    number: clientString
  });
}

wss.on('connection', (ws) => {

  // create and send color on connection
  const colors = {
    type: "colors",
    colorcode:  getRandomColor(),
  };

  ws.send(JSON.stringify(colors));

  updateOnlineUsers();
  
  ws.on('message', function incoming(data) {
    const bcmessage = JSON.parse(data);
    if(bcmessage["type"] === "postMessage") {

      bcmessage["id"] = uuid.v1();
      bcmessage["type"] = "incomingMessage";
      bcmessage["image"] = "";

      if(bcmessage["content"].includes("gif") || bcmessage["content"].includes("png") || bcmessage["content"].includes("jpg")) {
        let myurls = bcmessage["content"].match(/\b(http|https)?(:\/\/)?(\S*)\.(\w{2,4})\b/ig);
        bcmessage["content"] = bcmessage["content"].replace(myurls[0], "");
        bcmessage["image"] = myurls[0];
      }
    }
    
    if(bcmessage["type"] === "postNotification") {
      bcmessage["type"] = "incomingNotification";
      bcmessage["id"] = uuid.v1();
    }

    broadcast(bcmessage);
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    updateOnlineUsers();
  });
});

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
