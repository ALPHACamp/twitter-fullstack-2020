const db = require('../models');

const chatsController = {
  chatRoomPage: (req, res) => {
    res.render('chatroom', {
      title: {
        text: '公開聊天室',
      },
    });
  },

};
module.exports = chatsController;
