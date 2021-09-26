const helpers = require('../_helpers')
const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });
const db = require('../models')
const Message = db.Message
const PublicMessage = db.PublicMessage
const User = db.User
const Followship = db.Followship
const Room = db.Room
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply
const Subscribe = db.Subscribe
const { sequelize } = require('../models');
const { render } = require('../app');
const { Op } = require("sequelize");
const room = require('../models/room');
const { Console } = require('console');

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


  sendPrivateMsg: async (user, roomName, viewUserId) => {
    return Message.create({
      roomId: Number(roomName),
      content: user.msg,
      sendId: Number(user.id),
      toId: Number(viewUserId)
    })
  },

  privatePage: async (req, res) => {
    const currentUser = helpers.getUser(req)
    const viewUserId = Number(req.params.id)
    let roomName = ''
    //接收訊者的資料
    const viewUser = await User.findOne({
      where: { id: viewUserId },
      attributes: ['id', 'name', 'avatar', 'account'],
      raw: true,
      nest: true
    })

    //判斷roomId
    if (currentUser.id !== viewUserId) {
      //確認房間有無存在
      const room = await Room.findOne({
        where: {
          [Op.or]: [
            { userId: currentUser.id, toId: viewUserId },
            { userId: viewUserId, toId: currentUser.id },
          ]
        },
        raw: true,
        nest: true
      })
      if (!room) {
        //沒房間
        const newRoom = await Room.create({
          userId: currentUser.id, toId: viewUserId
        })
        //展開資料
        roomName = newRoom.id
      } else {
        roomName = room.id
      }

      //搜尋全部歷史訊息
      const msgs = await Message.findAll({
        where: {
          RoomId: roomName
        },
        include: [Room],
        raw: true,
        nest: true
      })

      const msg = msgs.map(d => ({
        ...d,
        selfMsg: d.sendId === currentUser.id ? true : false
      }))
      const randomUserId = Number(15 + 10 * ((Math.floor(Math.random() * 4) + 1)))
      return res.render('private-chat', { currentUser, viewUserId, randomUserId, roomName, msg, viewUser })
    }


    const randomUserId = Number(15 + 10 * ((Math.floor(Math.random() * 4) + 1)))
    return res.render('private-chat', { currentUser, viewUserId, randomUserId, viewUser })
  },

  getPrivateInbox: async (currentId, res, cb) => {
    const currentUserId = currentId
    const msgBoxes = await Message.findAll({
      attributes: ['sendId', 'toId', 'content', 'roomId', [sequelize.fn('max', sequelize.col('createdAt')), 'msgTime']],
      // include: [Room],
      group: ['roomId'],
      // order: [[sequelize.col('msgTime'), 'ASC']],
      raw: true,
      nest: true
    })

    const user = await User.findAll({
      attributes: ['id', 'account', 'avatar', 'name'],
      raw: true,
      nest: true
    })

    const msgBox = await msgBoxes.map(d => ({
      ...d,
      userName: user.filter(j => {
        if (d.sendId !== currentUserId) {
          return j.id === d.sendId
        } else {
          return j.id === d.stoId
        }
      })[0].name,
      userAccount: user.filter(j => {
        if (d.sendId !== currentUserId) {
          return j.id === d.sendId
        } else {
          return j.id === d.stoId
        }
      })[0].account,
      userAvatar: user.filter(j => {
        if (d.sendId !== currentUserId) {
          return j.id === d.sendId
        } else {
          return j.id === d.stoId
        }
      })[0].avatar,
      userId: user.filter(j => {
        if (d.sendId !== currentUserId) {
          return j.id === d.sendId
        } else {
          return j.id === d.stoId
        }
      })[0].id,
    }))
    return msgBox
  },
}

module.exports = messageController