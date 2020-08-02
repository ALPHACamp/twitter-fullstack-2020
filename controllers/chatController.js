const db = require('../models');
const Privatemassage = db.Privatemassage;
const Tweet = db.Tweet;
const User = db.User
const chatController = {
  getChatPage: (req, res) => {
    res.render('chatroom')
  },

  getOneChatPage: async (req, res) => {
    const id = req.user.id;
    let myMassage = await User.findOne({
      where: { id },
      include: [
        { model: User, as: 'RecipientId' },
        { model: User, as: 'SenderId', },
      ],
    })
    let massages = myMassage.toJSON().SenderId
    massages = massages.map((m) => ({
      ...m,
      senderUserName: m.name,
      senderUserAccount: m.account,
      senderUserAvatar: m.avatar,
      sendTime: m.privatemassage.time,
      sendMassage: m.privatemassage.massage.substring(0, 20),
    }))
    if (massages.length > 1) {
      massages = massages.sort((a, b) => b.sendTime - a.sendTime)[0];
    }
    res.render('oneChatroom', { historyMassages: massages })
  },
}

module.exports = chatController