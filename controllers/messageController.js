const helpers = require('../_helpers')
const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: {origin: "*"}});
const db = require('../models')
const Message = db.Message

const messageController = {
  renderPage: (req, res) => {
    const currentUser = helpers.getUser(req)
    return res.render('message', {currentUser})
  },
  sendMsg: (user) => {
    console.log('yo====',user.id)
    console.log(user.msg)
    return Message.create({
      userId: user.id,
      content: user.msg
    })
  }


}

module.exports = messageController