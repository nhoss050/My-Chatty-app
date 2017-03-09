// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const uuid = require('node-uuid');
const WebSocket = require('ws');
// Set the port to 3001
const PORT = 3001;

const clients = [];

//const colors = [red,blue,green,yellow];
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
  //console.log('Client connected');

const colors = {
        type: "colors",
        colorcode:  getRandomColor(),
      };




console.log("the colors object is:",colors)
ws.send(JSON.stringify(colors));


//------------------------------------------
  if (wss.clients.size === 1){

   let numberOfConnection = {
        type: "connections",
        number: `${wss.clients.size} user online`,
      };

    wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(numberOfConnection));
     // console.log("message was broadcasted",numberOfConnection);
    }
  });

   //console.log("yayyyyy",numberOfConnection)
  } else {
      let numberOfConnection = {
        type: "connections",
        number: `${wss.clients.size} users online`,
      };

    wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(numberOfConnection));
     // console.log("message was broadcasted",numberOfConnection);
    }
  });


  };




     // const numberOfConnection = {

     //    type: "connections",
     //    number: `${wss.clients.size} aecio online`
     //  }





  // wss.clients.forEach(function each(client) {
  //   if (client.readyState === WebSocket.OPEN) {
  //     client.send(JSON.stringify(numberOfConnection));
  //    // console.log("message was broadcasted",numberOfConnection);
  //   }
  // });

//------------------------------------------



  ws.on('message', function incoming(data) {


    const bcmessage = JSON.parse(data);
    console.log("message received",bcmessage);


    if(bcmessage["type"] === "postMessage") {
          //console.log("message came in", bcmessage);
        bcmessage["id"] = uuid.v1();
        bcmessage["type"] = "incomingMessage";

     console.log("correct one")

    }

    if(bcmessage["type"] === "postNotification") {
        //console.log("message came in", bcmessage);
        bcmessage["type"] = "incomingNotification";
        bcmessage["id"] = uuid.v1();
        console.log("wrong one")
    }


        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(bcmessage));
            console.log("message was broadcasted",bcmessage);
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
     // console.log("message was broadcasted",numberOfConnection);
    }
  });

   //console.log("yayyyyy",numberOfConnection)
  } else {
      let numberOfConnection = {
        type: "connections",
        number: `${wss.clients.size} users online`,
      };

    wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(numberOfConnection));
     // console.log("message was broadcasted",numberOfConnection);
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