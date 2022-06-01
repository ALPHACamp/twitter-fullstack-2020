const { getOffset, getPagination } = require('../helpers/pagination-helper')
const db = require('../models')
const { Op } = require('sequelize')
const { Tweet, User, Like, Reply, sequelize, Message } = db
const { catchTopUsers } = require('../helpers/sequelize-helper')
const helpers = require('../_helpers')
//
const messageController = {
  startChatting: async (req, res, next) => {
    try {
      const id = helpers.getUser(req).id
      const chatUsers = await User.findAll({
      //
        where: {
          [Op.or]: [sequelize.where(sequelize.col('sentMessages.receiverId'), id), sequelize.where(sequelize.col('receivedMessages.senderId'), id)]
        },
        include: [{ model: Message, as: 'sentMessages' }, { model: Message, as: 'receivedMessages' }],
        group: sequelize.col('User.id'),
        raw: true,
        nest: true
      })
      // console.log(chatUsers.length)
      // res.json(chatUsers)
      res.render('chat', { chatUsers })
    } catch (err) {
      next(err)
    }
  },
  startChattingWith: async (req, res, next) => {
    try {
      const id = helpers.getUser(req).id
      const newId = Number(req.params.id)
      const chatUsers = await User.findAll({
      //
        where: {
          [Op.or]: [sequelize.where(sequelize.col('sentMessages.receiverId'), id), sequelize.where(sequelize.col('receivedMessages.senderId'), id),{id:newId}]
        },
        include: [{ model: Message, as: 'sentMessages' }, { model: Message, as: 'receivedMessages' }],
        group: sequelize.col('User.id'),
        raw: true,
        nest: true
      })

      res.render('chat', { chatUsers , newId})
    } catch (err) {
      next(err)
    }
  }
}
module.exports = messageController
