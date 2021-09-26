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
    const room = await Room.findOrCreate({ where: { userId: user.id, toId: viewUserId } })
    console.log(room)
    return Message.create({
      roomId: room.id,
      content: user.msg,
    })
    },

  privatePage: async (req, res) => {
    const currentUser = helpers.getUser(req)
    const viewUserId = Number(req.params.id)

    //搜尋全部歷史訊息
    const msgs = await Room.findAll({
      where: {
        [Op.or]:
          [{ userId: currentUser.id, toId: viewUserId },
          { userId: viewUserId, toId: currentUser.id }]
      },
      include: [Message],
    })
    console.log('msgs', msgs)

    //接收訊者的資料
    const viewUser = await User.findOne({
      where: { id: viewUserId },
      attributes: ['id', 'name', 'avatar', 'account'],
      raw: true,
      nest: true
    })
    msg = await msgs.map(d => ({
      ...d.dataValues,
      // User: d.User.dataValues,
      selfMsg: Boolean(d.UserId === currentUser.id)
    }))
    return res.render('private-chat', { currentUser, msg, viewUserId, viewUser })
  },

  // getPrivateInbox: async (currentId, res, cb) => {
  //   console.log('資料庫前條件', currentId)
  //   const currentUser = await User.findOne({
  //     where: { id: currentId},
  //     raw:true,
  //     nest:true
  //   })
  //   const datas = await Message.findAll({
  //     where: {
  //       roomName: {
  //         [Op.not]: null
  //       }
  //     },
  //     include: [
  //       { model: User, attributes: ['id', 'avatar', 'name', 'account'] },
  //       { model: User, as: 'toIdUser', attributes: ['id','avatar', 'name', 'account'] }
  //     ],
  //     // order: sequelize.query('select from Message order by createdAt desc', {
  //     //   type: sequelize.QueryTypes.SELECT
  //     // }),
  //     group: ['roomName'],
  //     raw: true,
  //     nest: true
  //   })
  //   console.log('rawData', datas)

  //   const data = await datas.map(d => ({
  //     ...d,
  //     content: d.content.length > 12 ? d.content.substring(0, 12) + '...' : d.content,
  //     showUserName: d.toIdUser.id === currentUser.id ? d.User.id : d.toIdUser.id,
  //     showUserAccount: d.toIdUser.id === currentUser.id ? d.User.account : d.toIdUser.account ,
  //     showUserAvatar: d.toIdUser.id === currentUser.id ? d.User.avatar : d.toIdUser.avatar ,
  //   }))
  //   console.log('整理前', data)
  //   const msg = await data.filter(d => {
  //     return (Number(d.toId) === Number(currentUser.id) || Number(d.UserId) === Number(currentUser.id))
  //   })
  //   console.log('整理後', msg)
  //   return msg
  // },
}

module.exports = messageController