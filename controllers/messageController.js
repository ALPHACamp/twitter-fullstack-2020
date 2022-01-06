const helpers = require('../_helpers')
// const express = require('express')
// const app = express()
// const http = require('http')
// const server = http.createServer(app)
// const { Server } = require("socket.io")
// const io = new Server(server)
const db = require('../models')
const PublicMessage = db.PublicMessage
const User = db.User

// const { sequelize } = require('../models')
// const { render } = require('../app')
// const { Op } = require("sequelize")
// const { Console } = require('console')

const messageController = {
  publicPage: (req, res) => {
    const currentUser = helpers.getUser(req)
    
    PublicMessage.findAll({
      include: [{ model: User, attributes: ['id', 'avatar', 'name', 'account'] }],
      order: [['createdAt', 'ASC']],
    })
      .then(msg => {
        msg = msg.map(d => ({
          ...d.dataValues,
          User: d.User.dataValues,
          selfMsg: Boolean(d.userId === currentUser.id)
        }))
        return res.render('public-chat', { currentUser, msg })
      })
  },

  sendMsg: (user) => {
    return PublicMessage.create({
      userId: user.id,
      content: user.msg,
    })
  },
}

module.exports = messageController