const { Op } = require('sequelize');
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
    const userMessaging = (req.params.receiverId) ? Number(req.params.receiverId) : null;
    const privateMessageSenderId = getUser(req);

    Promise.all([
      Message.findAll({
        raw  : true,
        nest : true,
        where: {
          [Op.or]: [
            {
              senderId: privateMessageSenderId,
            },
            {
              receiverId: privateMessageSenderId,
            },
          ],
          isPublic: 0,
        },
        include: [{
          model: User,
          as   : 'Sender',
        }, {
          model: User,
          as   : 'Receiver',
        }],
        order: [
          // Will escape title and validate DESC against a list of valid direction parameters
          ['createdAt', 'DESC'],
        ],
      }),
    ])
    .then(([interactionMessages]) => {
      // Modify interacted user list
      const userList = [];
      interactionMessages.forEach((message) => {
        if (message.Sender.id === Number(privateMessageSenderId)) {
          const receiverObj = message.Receiver;
          Object.assign(receiverObj, {
            lastMessage: message.message,
            createdAt  : message.createdAt,
          });
          userList.push(receiverObj);
        } else {
          const senderObj = message.Sender;
          delete senderObj.password;
          Object.assign(senderObj, {
            lastMessage: message.message,
            createdAt  : message.createdAt,
          });
          userList.push(senderObj);
        }
      });

      const interactedUserList = userList
      .filter((v, i, a) => a.findIndex((t) => (t.id === v.id)) === i)
      .map((user) => ({
        ...user,
        createdAt: `${moment(user.createdAt).format('a h:mm')}`,
      }));

      return res.render('chatroom', {
        title: {
          text: '私人訊息',
        },
        usersInteracted: interactedUserList,
        userMessaging,
      });
    });
  },
};
module.exports = chatsController;
