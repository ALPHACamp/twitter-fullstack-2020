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
    const talkers = await Message.findAll({
      where: { type: "1" },
      include: [
        { model: User, as: "fromId" },
        { model: User, as: "toId" }
      ]
    })
    console.log(talkers)
    res.render('globalChat', { OpenChat: true, talkers })
  }
}

module.exports = chatController