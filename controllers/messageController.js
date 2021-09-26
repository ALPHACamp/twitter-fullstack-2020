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
    // const test = await Room.findAll({
    //   where: {
    //     [Op.or]: [
    //       { userId: currentUser.id },
    //       { toId: currentUser.id },
    //     ]
    //   },
    //   include: [{ model: Message, attributes: {include: [[sequelize.fn('MAX', sequelize.col('createdAt'))]]} }]
    // })
    const currentUserId = currentId
    const msgBoxes = await Message.findAll({
      attributes: ['sendId','toId','content', 'roomId', [sequelize.fn('max', sequelize.col('createdAt')), 'msgTime']],
      // include: [Room],
      group: ['roomId'],
      // order: [[sequelize.col('msgTime'), 'ASC']],
      raw: true,
      nest: true
    })

    const user = await User.findAll({
      attributes: [ 'id', 'account', 'avatar', 'name'],
      raw:true,
      nest:true
    })

    const msgBox = await msgBoxes.map(d => ({
      ...d,
      userName: user.filter(j => { 
        if (d.sendId !== currentUserId){
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



    // console.log('測試結果1===', msgBox)
    // console.log('測試結果2===', msgBox.User)
    return msgBox

  }
  ,


  // subscribe: async (req, res) => {
  //   const currentUser = helpers.getUser(req)
  //   try {
  //     //中間資料大戰


  //     //追蹤者
  //     const users = await Followship.findAll({
  //       attributes: ['followingId', [sequelize.fn('COUNT', sequelize.col('followingId')), 'count']],
  //       include: [
  //         { model: User, as: 'FollowingLinks' }, //self-referential super-many-to-many
  //       ],
  //       group: ['followingId'],
  //       order: [[sequelize.col('count'), 'DESC']],
  //       limit: 10, raw: true, nest: true
  //     })

  //     //B. 右側欄位: 取得篩選過的使用者 & 依 followers 數量排列前 10 的使用者推薦名單(排除追蹤者為零者)
  //     const normalUsers = users.filter(d => d.FollowingLinks.role !== 'admin')
  //     const topUsers = normalUsers.map(user => ({
  //       id: user.FollowingLinks.id,
  //       name: user.FollowingLinks.name ? (user.FollowingLinks.name.length > 12 ? user.FollowingLinks.name.substring(0, 12) + '...' : user.FollowingLinks.name) : 'noName',
  //       account: user.FollowingLinks.account ? (user.FollowingLinks.account.length > 12 ? user.FollowingLinks.account.substring(0, 12) + '...' : user.FollowingLinks.account) : 'noAccount',
  //       avatar: user.FollowingLinks.avatar,
  //       followersCount: user.count,
  //       isFollowed: currentUser.Followings.map((d) => d.id).includes(user.FollowingLinks.id),
  //       isSelf: Boolean(user.FollowingLinks.id === currentUser.id),
  //     }))

  //     return res.render('notification', { topUsers, currentUser })
  //   } catch { error => { console.log(error) } }

  // },

  // subscription: async (req, res) => {
  //   try {
  //     const fansId = helpers.getUser(req).id
  //     const InfluencerId = Number(req.params.id)
  //     const targetUser = await User.findByPk(InfluencerId)
  //     const subscription = await Subscribe.findOne({
  //       where: {
  //         [Op.and]: [
  //           { fansId },
  //           { InfluencerId }
  //         ]
  //       }
  //     })

  //     if (fansId === InfluencerId) {

  //       req.flash('error_messages', '無法訂閱自己')
  //       return res.redirect('back')
  //     }
  //     if (!targetUser) {
  //       req.flash('error_messages', '無效對象')
  //       return res.redirect('back')
  //     }

  //     if (subscription) {
  //       req.flash('error_messages', '不得重複訂閱')
  //       return res.redirect('back')

  //     } else {
  //       await Subscribe.create({
  //         fansId,
  //         InfluencerId
  //       })
  //       req.flash('success_messages', '成功訂閱')
  //       return res.redirect('back')
  //     }
  //   }
  //   catch (err) {
  //     console.log(err)
  //   }
  // }

}

module.exports = messageController