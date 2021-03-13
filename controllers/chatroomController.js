const db = require('../models')
const { User, Tweet } = db
const helpers = require('../_helpers')

const chatroomController = {
  getPublic: (req, res) => {
    res.render('chatroom/public')
  }
}

module.exports = chatroomController