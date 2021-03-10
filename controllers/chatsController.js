const db = require('../models');

const chatsController = {
  chatRoomPage: (req, res) => {
    res.render('chatroom');
  },

};
module.exports = chatsController;
