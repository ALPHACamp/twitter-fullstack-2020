// const io = require('socket.io')
// const http = require('http')
// const socket = io(http)
// const helpers = require('../_helpers')

const chatController = {
  getChatPage: (req, res) => {
    res.render('chatroom')
  }
}

module.exports = chatController