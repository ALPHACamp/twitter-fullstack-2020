const moment = require('moment');

moment.locale('zh-TW');
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
    const userMessaging = req.params.receiverId ? Number(req.params.receiverId) : null;
    const privateMessageSender = getUser(req);
    Promise.all([
      User.findByPk(req.params.receiverId),
      Message.findAll({
        raw  : true,
        nest : true,
        where: {
          [Op.or]: [
            {
              senderId: privateMessageSender.id,
            },
            {
              receiverId: privateMessageSender.id,
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
    .then(([receiver, interactionMessages]) => {
      // Modify interacted user list
      const userList = [];
      interactionMessages.forEach((message) => {
        if (message.Sender.id === Number(privateMessageSender.id)) {
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
      .filter((v, i, a) => a.findIndex((t) => (t.id === v.id)) === i);

      // 私人聊天室首頁目前與和對方聊天室頁面共用 getPrivateChatPage controller
      // 先寫以下的條件來找到receiver，因應不同情況所需要的東西。 ex. 標題切換，不同對象用戶名和帳號會跟著更改
      if (userMessaging) {
        return res.render('chatroom', {
          privateMessagePage: true,
          title             : {
            user_name   : receiver.dataValues.name,
            user_account: receiver.dataValues.account,
          },
          usersInteracted: interactedUserList,
          userMessaging,
        });
      }
      return res.render('chatroom', {
        title: {
          text: '私人聊天室',
        },
        usersInteracted: interactedUserList,
        userMessaging,
      });
    });
  },
};
module.exports = chatsController;
