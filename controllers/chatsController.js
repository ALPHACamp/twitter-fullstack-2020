const db = require('../models');

const chatsController = {
  getPublicChatPage: (req, res) => {
    res.render('chatroom', {
      title: {
        text: '公開聊天室',
      },
    });
  },

};
module.exports = chatsController;
