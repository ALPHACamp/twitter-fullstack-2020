const moment = require('moment')
const db = require('./models')
const Message = db.Message
const User = db.User

module.exports = {
  formatMessage(name, data, avatar, currentUser) {
    return {
      message: data,
      name,
      avatar,
      currentUser,
      time: moment().format('LT')
    }
  },
  getHistoryMessage(user) {
    let historyMessages = []
    return Message.findAll({ include: [User], order: [['createdAt', 'DESC']] })
      .then(data => {
        return historyMessages = data.map(item => ({
          message: item.dataValues.message,
          name: item.dataValues.User.name,
          avatar: item.dataValues.User.avatar,
          currentUser: user.id === item.dataValues.User.id ? true : false,
          time: moment(item.dataValues.createdAt).format('LT')
        }))
      })
  }
}