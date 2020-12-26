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
    res.render('globalChat', { OpenChat: true, talkers })
  }
}

module.exports = chatController