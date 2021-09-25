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
const { sequelize } = require('../models')

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

  privatePage: (req, res) => {
    const currentUser = helpers.getUser(req)
    const currentUserId = Number(helpers.getUser(req).id)
    const viewUserId = Number(req.params.id)
    let roomName = currentUserId > viewUserId ? `${viewUserId}-${currentUserId}` : `${currentUserId}-${viewUserId}`

    return Message.findAll({
      where: { roomName: roomName },
      include: [{ model: User, attributes: ['id', 'avatar', 'name', 'account'] }],
      order: [['createdAt', 'ASC']],
    })
      // userList.push(currentUserId.toString()"="viewUserId)
      // console.log(userList) 
      .then(msg => {
        msg = msg.map(d => ({
          ...d.dataValues,
          User: d.User.dataValues,
          selfMsg: Boolean(d.UserId === currentUser.id)
        }))
        console.log('私人訊息篩選====', msg)
        return res.render('private-chat', { roomName, currentUser, msg, viewUserId })
      })
  },

  getPrivateInbox: (currentId, res, cb) => {
  // const currentUserId = Number(currentId)
  // const viewUserId = Number(viewUserId)
    // console.log('DBcurrentId', currentUserId)
    // console.log('DBviewUserId', viewUserId)
    // let roomName = currentUserId > viewUserId ? `${viewUserId}-${currentUserId}` : `${currentUserId}-${viewUserId}`
    console.log('資料庫前條件', currentId)
    return Message.findAll({
      where: { UserId: currentId },
      include: [User],
      // attributes: [[sequelize.fn('COUNT', sequelize.col('createdAt')), 'tweetCount']],
      // order: [[sequelize.fn('MAX', 'createdAt'), 'ASC']],
      group: ['toId'],
      raw:true,
      nest:true
    })
    .then(msg => {
      return console.log('資料庫找完', msg)
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