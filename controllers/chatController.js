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
      where: {
        type: "0",
        [Op.or]: [{ ToId: helpers.getUser(req).id }, { FromId: helpers.getUser(req).id }]
      },
      include: [
        { model: User, as: "fromId" },
        { model: User, as: "toId" }
      ]
    })

    if (talkers.length > 1) {
      talkers = talkers.sort((a, b) => a.dataValues.updatedAt - b.dataValues.updatedAt)
    }

    let alluser = await User.findAll()
    messagePusher = alluser.filter(user => talkers.map(d => d.dataValues.FromId).includes(user.dataValues.id))
    messageReceiver = alluser.filter(user => talkers.map(d => d.dataValues.ToId).includes(user.dataValues.id))

    let messager = messagePusher.concat(messageReceiver)
    messager = [...new Map(messager.map(item => [item.dataValues.id, item])).values()]
    messager = messager.filter(user => Number(user) !== Number(helpers.getUser(req).id))

    let latestNew = []
    const userId = Number(helpers.getUser(req).id)
    for (let user of messager) {
      let otherId = Number(user.dataValues.id)
      let talker = talkers.filter(msg => (Number(msg.dataValues.FromId) === userId && Number(msg.dataValues.ToId) === otherId) || (Number(msg.dataValues.FromId) === otherId && Number(msg.dataValues.ToId) === userId))
      talker = talker.sort((a, b) => a.dataValues.updatedAt - b.dataValues.updatedAt)[0]
      if (talker) {
        talker.id_From_ToId = user.dataValues.id
        talker.avatar_From_ToId = user.dataValues.avatar
        talker.name_From_ToId = user.dataValues.name
        talker.account_From_ToId = user.dataValues.account
        latestNew.push(talker)
      }
    }
    latestNew = latestNew.sort((a, b) => a.dataValues.updatedAt - b.dataValues.updatedAt)
    res.render('privateChat', { OpenChat: true, ChatwithP: false, talkers, latestNew })
  },

  getPrivateChat_with: async (req, res) => {
    let talkers = await Message.findAll({
      where: {
        type: "0",
        [Op.or]: [{ ToId: helpers.getUser(req).id }, { FromId: helpers.getUser(req).id }]
      },
      include: [
        { model: User, as: "fromId" },
        { model: User, as: "toId" }
      ]
    })

    if (talkers.length > 1) {
      talkers = talkers.sort((a, b) => a.dataValues.updatedAt - b.dataValues.updatedAt)
    }

    let alluser = await User.findAll()
    messagePusher = alluser.filter(user => talkers.map(d => d.dataValues.FromId).includes(user.dataValues.id))
    messageReceiver = alluser.filter(user => talkers.map(d => d.dataValues.ToId).includes(user.dataValues.id))

    let messager = messagePusher.concat(messageReceiver)
    messager = [...new Map(messager.map(item => [item.dataValues.id, item])).values()]
    messager = messager.filter(user => Number(user) !== Number(helpers.getUser(req).id))

    let latestNew = []
    const userId = Number(helpers.getUser(req).id)
    for (let user of messager) {
      let otherId = Number(user.dataValues.id)
      let talker = talkers.filter(msg => (Number(msg.dataValues.FromId) === userId && Number(msg.dataValues.ToId) === otherId) || (Number(msg.dataValues.FromId) === otherId && Number(msg.dataValues.ToId) === userId))
      talker = talker.sort((a, b) => a.dataValues.updatedAt - b.dataValues.updatedAt)[0]
      if (talker) {
        talker.id_From_ToId = user.dataValues.id
        talker.avatar_From_ToId = user.dataValues.avatar
        talker.name_From_ToId = user.dataValues.name
        talker.account_From_ToId = user.dataValues.account
        latestNew.push(talker)
      }
    }
    latestNew = latestNew.sort((a, b) => a.dataValues.updatedAt - b.dataValues.updatedAt)

    userId_1 = helpers.getUser(req).id
    userId_2 = req.params.id

    talkers = await Message.findAll({
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
    res.render('privateChat', { OpenChat: true, ChatwithP: true, talkers, latestNew })
  },
}

module.exports = chatController