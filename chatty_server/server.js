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

wss.on('connection', (ws) => {

// create and send color on connection
  const colors = {
        type: "colors",
        colorcode:  getRandomColor(),
  };

  ws.send(JSON.stringify(colors));


//creat number of online users and sed
  if (wss.clients.size === 1){

   let numberOfConnection = {
       type: "connections",
       number: `${wss.clients.size} user online`,
    };

    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(numberOfConnection));
      }
    });

  } else {
    let numberOfConnection = {
        type: "connections",
        number: `${wss.clients.size} users online`,
    };

    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(numberOfConnection));
      }
    });


  };



  ws.on('message', function incoming(data) {

    const bcmessage = JSON.parse(data);


      if(bcmessage["type"] === "postMessage") {

          bcmessage["id"] = uuid.v1();
          bcmessage["type"] = "incomingMessage";
      }

      if(bcmessage["type"] === "postNotification") {

          bcmessage["type"] = "incomingNotification";
          bcmessage["id"] = uuid.v1();
      }


      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(bcmessage));
          onsole.log("message was broadcasted",bcmessage);
        }
      });

  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.



  ws.on('close', () => {

    if (wss.clients.size === 1){

      let numberOfConnection = {
          type: "connections",
          number: `${wss.clients.size} user online`,
      };

      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(numberOfConnection));
        }
      });


    } else {
      let numberOfConnection = {
          type: "connections",
          number: `${wss.clients.size} users online`,
      };

      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
         client.send(JSON.stringify(numberOfConnection));
       }
      });
    }



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