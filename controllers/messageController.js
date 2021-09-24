const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: {origin: "*"}});

const messageController = {
  sendMsg: (req, res) => {

  //     io.on('connection', (socket) => {

  //   console.log("User connected:"+ socket.id)
  //   //   socket.on('chat message', (msg) => {
  //   //   console.log('message: ' + msg);
  //   //   });
      
  // });
    // io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); 
    // This will emit the event to all connected sockets
    return res.render('message')
  
  },
  
}

module.exports = messageController