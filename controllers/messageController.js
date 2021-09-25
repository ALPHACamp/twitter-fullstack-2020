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

const messageController = {
  publicPage: (req, res) => {
    const currentUser = helpers.getUser(req)
    // console.log(currentUser.id)
    Message.findAll({
      include: [{ model: User, attributes: ['id', 'avatar', 'name', 'account'] }],
      order: [['createdAt', 'ASC']],
      // raw: true, nest: true
    })
      .then(msg => {
        msg = msg.map(d => ({
          ...d.dataValues,
          User: d.User.dataValues,
          selfMsg: Boolean(d.UserId === currentUser.id)
        }))
        // console.log('New=====', msg)
        return res.render('public-chat', { currentUser, msg })
      })

  },
  sendMsg: (user, roomName) => {
    return Message.create({
      UserId: user.id,
      content: user.msg,
      roomName
    })
  },

  privatePage: (req, res) => {
    const currentUser = helpers.getUser(req)
    const currentUserId = String(helpers.getUser(req).id)
    const viewUserId = String(req.params.id)
    // console.log(currentUser.id)
    // console.log(viewUserId)
    let roomName = `${currentUserId}-${viewUserId}`
    // userList.push(currentUserId.toString()"="viewUserId)
    // console.log(userList) 
    res.render('private-chat', { roomName, currentUser })
  },
  // savePrivateMsg: (user) => {

  //   return Message.create({
  //     UserId: user.id,
  //     content: user.msg,
  //     roomName
  //   })
  // },


}

module.exports = messageController