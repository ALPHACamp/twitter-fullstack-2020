const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: {origin: "*"}});

const messageController = {
  renderPage: (req, res) => {
    return res.render('message')
  },
  sendMsg: (user) => {
    console.log(user.id)
    console.log(user.msg)
  }


}

module.exports = messageController