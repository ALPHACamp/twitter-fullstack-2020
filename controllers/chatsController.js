const db = require('../models');

const { Message, User } = db;

const { getUser } = require('../_helpers');

const chatsController = {
  getPublicChatPage: (req, res) => {
    res.render('chatroom', {
      title: {
        text: '公開聊天室',
      },
    });
  },
  getPrivateChatPage: (req, res) => {
    let userMessaging;
    if (req.params.receiverId) {
      req.app.set('privateMessageReceiverId', Number(req.params.receiverId));
      userMessaging = Number(req.params.receiverId);
    }

    // TODO: get list of users the current user has sent PM to, assign it back as usersPMSent
    const usersPMSent = [
      getUser(req),
      getUser(req),
    ];

    res.render('chatroom', {
      title: {
        text: '私人訊息',
      },
      usersPMSent,
      userMessaging,
    });
  },
};
module.exports = chatsController;
