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

const subscribeController = {

  subscribe: async (req, res) => {
  const currentUser = helpers.getUser(req)
  try {
    //中間資料大戰
    const Influencer = await Subscribe.findAll({
      where: {fansId:currentUser.id},
       include:[{ 
        model: User, 
        as: 'fansLinks',
        attributes: ['id', 'name', 'avatar']
       }],
      raw: true, nest: true
    })

    //追蹤者
    const users = await Followship.findAll({
      attributes: ['followingId', [sequelize.fn('COUNT', sequelize.col('followingId')), 'count']],
      include: [
        { model: User, as: 'FollowingLinks' }, //self-referential super-many-to-many
      ],
      group: ['followingId'],
      order: [[sequelize.col('count'), 'DESC']],
      limit: 10, raw: true, nest: true
    })

    //A.中間欄位
    const InfluencerData = Influencer.map(d => ({
      id: d.fansLinks.id,
      name: d.fansLinks.name,
      avatar:d.fansLinks.avatar
    }))

    //B. 右側欄位: 取得篩選過的使用者 & 依 followers 數量排列前 10 的使用者推薦名單(排除追蹤者為零者)
    const normalUsers = users.filter(d => d.FollowingLinks.role !== 'admin')
    const topUsers = normalUsers.map(user => ({
      id: user.FollowingLinks.id,
      name: user.FollowingLinks.name ? (user.FollowingLinks.name.length > 12 ? user.FollowingLinks.name.substring(0, 12) + '...' : user.FollowingLinks.name) : 'noName',
      account: user.FollowingLinks.account ? (user.FollowingLinks.account.length > 12 ? user.FollowingLinks.account.substring(0, 12) + '...' : user.FollowingLinks.account) : 'noAccount',
      avatar: user.FollowingLinks.avatar,
      followersCount: user.count,
      isFollowed: currentUser.Followings.map((d) => d.id).includes(user.FollowingLinks.id),
      isSelf: Boolean(user.FollowingLinks.id === currentUser.id),
    }))

    return res.render('notification', { topUsers, currentUser, InfluencerData})
  } catch { error => { console.log(error) } }

},

subscription: async (req, res) => {
  try {
    const fansId = helpers.getUser(req).id
    const InfluencerId = Number(req.params.id)
    const targetUser = await User.findByPk(InfluencerId)
    const subscription = await Subscribe.findOne({
      where: {
        [Op.and]: [
          { fansId },
          { InfluencerId }
        ]
      }
    })

    if (fansId === InfluencerId) {

      req.flash('error_messages', '無法訂閱自己')
      return res.redirect('back')
    }
    if (!targetUser) {
      req.flash('error_messages', '無效對象')
      return res.redirect('back')
    }

    if (subscription) {
      req.flash('error_messages', '不得重複訂閱')
      return res.redirect('back')

    } else {
      await Subscribe.create({
        fansId,
        InfluencerId
      })
      req.flash('success_messages', '成功訂閱')
      return res.redirect('back')
    }
  }
  catch (err) {
    console.log(err)
  }
},

 //取消訂閱
 removeSubscribe:(req, res) => {
  const currentUserId = helpers.getUser(req).id
  return Subscribe.destroy({
    where:{
      fansId: currentUserId,
      InfluencerId: req.params.id
    }
  })
  .then(() => {
    return res.redirect('back')
  })
 },

}
module.exports = subscribeController