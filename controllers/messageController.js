// const express = require('express')
// const app = express()
// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server, { cors: { origin: "*" } });



const messageController = {
  sendMsg: (req, res) => {
    
    console.log('ji')
    // io.on('connection', (socket) => {
    //   console.log('new user connected2')
    //   socket.on('chat message', (msg) => {
    //     io.emit('chat message', msg);
    //   });
    // });


    // socket.on('connect', (msg) => {
    // console.log('connected to sever')
    // io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });
    // This will emit the event to all connected sockets
    // io.emit('chat message', msg)
    // console.log('message: ' + msg)
    // })


    return res.render('message')

  },

}

module.exports = messageController