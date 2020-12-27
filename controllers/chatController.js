const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const axios = require('axios')
const helpers = require('../_helpers')

const db = require('../models')
const { User, Message } = db

const chatController = {
  //////////////
  //global
  //////////////
  getGlobalChat: async (req, res) => {
    let talkers = await Message.findAll({
      where: { type: "1" },
      include: [
        { model: User, as: "fromId" },
        { model: User, as: "toId" }
      ]
    })

    if (talkers.length > 1) {
      talkers = talkers.sort((a, b) => a.dataValues.updatedAt - b.dataValues.updatedAt)
    }
    let onlineUsers = await User.findAll({ where: { login: true } })

    res.render('globalChat', { OpenChat: true, talkers, onlineUsers })
  },

  //////////////
  //Private
  //////////////
  getPrivateChat: async (req, res) => {
    let talkers = await Message.findAll({
      where: { type: "0" },
      include: [
        { model: User, as: "fromId" },
        { model: User, as: "toId" }
      ]
    })

    if (talkers.length > 1) {
      talkers = talkers.sort((a, b) => a.dataValues.updatedAt - b.dataValues.updatedAt)
    }
    res.render('privateChat', { OpenChat: true, talkers })
  },

  getPrivateChat_with: async (req, res) => {
    userId_1 = helpers.getUser(req).id
    userId_2 = req.params.id

    let talkers = await Message.findAll({
      where: { type: "0" },
      include: [
        { model: User, as: "fromId" },
        { model: User, as: "toId" }
      ]
    })

    talkers = talkers.filter(message => message.toId)
    talkers = talkers.filter(message =>
    ((Number(message.fromId.dataValues.id) === Number(userId_1) && Number(message.toId.dataValues.id) === Number(userId_2)) ||
      (Number(message.fromId.dataValues.id) === Number(userId_2) && Number(message.toId.dataValues.id) === Number(userId_1))))

    if (talkers.length > 1) {
      talkers = talkers.sort((a, b) => a.dataValues.updatedAt - b.dataValues.updatedAt)
    }
    res.render('privateChat', { OpenChat: true, talkers, userId_2 })
  },
}

module.exports = chatController