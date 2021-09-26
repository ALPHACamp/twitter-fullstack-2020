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
const { QueryTypes } = require('sequelize');

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
      where: { id: viewUserId },
      attributes: ['name', 'account'],
      raw: true,
      nest: true
    })
    console.log('viewUser==========', viewUser)
    msg = await msgs.map(d => ({
      ...d.dataValues,
      User: d.User.dataValues,
      selfMsg: Boolean(d.UserId === currentUser.id)
    }))
    return res.render('private-chat', { roomName, currentUser, msg, viewUserId, viewUser })
  },

  getPrivateInbox: async (currentId, res, cb) => {
    console.log('資料庫前條件', currentId)
    const toId = currentId

    // const rawData = await sequelize.query("SELECT * FROM `Message` ORDER BY `createdAt` DESC", { type: sequelize.QueryTypes.SELECT, raw: true, nest: true })
    const datas = await Message.findAll({
      include: [
        { model: User, attributes: ['id', 'avatar', 'name', 'account'] },
      ],
      // order: sequelize.query('select from Message order by createdAt desc', {
      //   type: sequelize.QueryTypes.SELECT
      // }),
      group:['roomName'],
      raw: true,
      nest: true
    })
    // console.log('rawData', rawData)

    const data = await datas.map(d => ({
      ...d,
      content: d.content.length > 12 ? d.content.substring(0, 12) + '...' : d.content,
      // toUserName:,
      // toUserAccount:,
      // toUserAvatar: ,
    }))
    console.log('整理前',data)
    const msg = await data.filter(d => {
      return (Number(d.toId) === Number(toId) || Number(d.UserId) === Number(toId))
    })
    console.log('整理後', msg)
    return msg
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