const chatroomController = {
  getPublic: (req, res) => {
    res.render('chatroom/public')
  },
  getPrivate: (req, res) => {
    res.render('chatroom/private')
  }
}

module.exports = chatroomController
