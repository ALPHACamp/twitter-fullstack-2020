const helpers = require('../_helpers')
const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });
const db = require('../models')
const Message = db.Message
const User = db.User
const { Op } = require("sequelize")
const sequelize = require('sequelize')

const messageController = {
  publicPage: (req, res) => {
    const currentUser = helpers.getUser(req)
    Message.findAll({
      where: { roomName: null },
      include: [{ model: User, attributes: ['id', 'avatar', 'name', 'account'] }],
      order: [['createdAt', 'ASC']],
    })
      .then(msg => {
        msg = msg.map(d => ({
          ...d.dataValues,
          User: d.User.dataValues,
          selfMsg: Boolean(d.UserId === currentUser.id)
        }))
        return res.render('public-chat', { currentUser, msg })
      })

  },
  sendMsg: (user, roomName, viewUserId) => {
    return Message.create({
      UserId: user.id,
      content: user.msg,
      roomName,
      toId: viewUserId
    })
  },

  privatePage: async (req, res) => {
    const currentUser = helpers.getUser(req)
    const currentUserId = Number(helpers.getUser(req).id)
    const viewUserId = Number(req.params.id)
    let roomName = currentUserId > viewUserId ? `${viewUserId}-${currentUserId}` : `${currentUserId}-${viewUserId}`

    const msgs = await Message.findAll({
      where: { roomName: roomName },
      include: [{ model: User, attributes: ['id', 'avatar', 'name', 'account'] }],
      order: [['createdAt', 'ASC']],
    })
    const viewUser = await User.findOne({
      where: { id: viewUserId},
      attributes: ['name', 'account'],
      raw:true,
      nest:true
    })
    console.log('viewUser==========', viewUser) 
    msg = await msgs.map(d => ({
      ...d.dataValues,
      User: d.User.dataValues,
      selfMsg: Boolean(d.UserId === currentUser.id)
    }))
    return res.render('private-chat', { roomName, currentUser, msg, viewUserId, viewUser })
  },

  getPrivateInbox: (currentId, res, cb) => {
    console.log('資料庫前條件', currentId)
    const toId = currentId
    return Message.findAll({
      where: {
        [Op.or]: [
          { UserId: currentId },
          { toId: currentId }
        ]
      },
      include: [User],
      order: sequelize.col('createdAt'),
      group: ['roomName'],
      raw: true,
      nest: true
    })
      .then(datas => {
        const data = datas.map(d => ({
          ...d,
          content: d.content.length > 12 ? d.content.substring(0, 12) + '...' : d.content
        }))
        console.log(datas)
        // const msg = data.filter(d => {
        //   return Number(d.toId) === Number(toId)
        // })
        // console.log('整理後', msg)
        return data
      })
  }

  // savePrivateMsg: (user) => {

  //   return Message.create({
  //     UserId: user.id,
  //     content: user.msg,
  //     roomName
  //   })
  // },


}

module.exports = messageController