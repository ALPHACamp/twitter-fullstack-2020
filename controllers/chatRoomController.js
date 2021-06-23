const helpers = require('../_helpers')
const db = require('../models')
const User = db.User


const chatRoomController = {
  getChatRoom: (req, res) => {
    res.render('chatRoom')
  }
}

module.exports = chatRoomController 
