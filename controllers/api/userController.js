const helpers = require('../../_helpers')
const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User
const { Op } = require("sequelize")
const sequelize = require('sequelize')
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship


const imgur = require('imgur-node-api')
const { fakeServer } = require('sinon')
const followship = require('../../models/followship')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  getUserFollowings: (req, res) => {
    const currentUser = helpers.getUser(req)
    return Promise.all([
      User.findOne({
        where: { id: req.params.user_id },
        include: [
          { model: Tweet },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      Followship.findAll({
        attributes: ['followingId', [sequelize.fn('COUNT', sequelize.col('followingId')), 'count']],
        include: [
          { model: User, as: 'FollowingLinks' } //self-referential super-many-to-many
        ],
        group: ['followingId'],
        order: [[sequelize.col('count'), 'DESC']],
        limit: 10, raw: true, nest: true
      }),
    ]).then(([user, users]) => {
      //整理某使用者的所有推文 & 每則推文的留言數和讚數 & 登入中使用者是否有按讚
      const usersFollowings = user.Followings.map(d => ({
        ...d.dataValues,
        isFollowed: currentUser.Followings.map((d) => d.id).includes(d.dataValues.id)
      }))

      let noFollowing = usersFollowings.length === 0 ? true : false

      //A. 取得某使用者的個人資料 & followship 數量 & 登入中使用者是否有追蹤
      const viewUser = Object.assign({}, {
        id: user.id,
        name: user.name,
        tweetsCount: user.Tweets.length,
      })
      //B. 右側欄位: 取得篩選過的使用者 & 依 followers 數量排列前 10 的使用者推薦名單(排除追蹤者為零者)
      const normalUsers = users.filter(d => d.FollowingLinks.role === 'normal')//排除admin
      const topUsers = normalUsers.map(user => ({
        id: user.FollowingLinks.id,
        name: user.FollowingLinks.name.length > 12 ? user.FollowingLinks.name.substring(0, 12) + '...' : user.FollowingLinks.name,
        account: user.FollowingLinks.account.length > 12 ? user.FollowingLinks.account.substring(0, 12) + '...' : user.FollowingLinks.account,
        avatar: user.FollowingLinks.avatar,
        followersCount: user.count,
        isFollowed: currentUser.Followings.map((d) => d.id).includes(user.FollowingLinks.id),
        isSelf: Boolean(user.FollowingLinks.id === currentUser.id),
      }))
      return res.json({
        usersFollowings: usersFollowings.length !== 0 ? usersFollowings : true,
        user: req.user,
        topUsers,
        viewUser,
        noFollowing
      })
    })
  },

  addFollowing: async (req, res) => {
    try {
      const followerId = helpers.getUser(req).id
      const followingId = Number(req.params.user_id)
      const user = await User.findByPk(followerId)
      const targetUser = await User.findByPk(followingId)
      const followship = await Followship.findOne({
        where: {
          [Op.and]: [
            { followerId },
            { followingId }
          ]
        }
      })


      if (!user || !targetUser) {
        req.flash('error_messages', '無效使用者')
        return res.status(400).redirect('/tweets')
      }

      if (followerId === followingId) {
        req.flash('error_messages', '無法追蹤自己')
        return res.status(400).redirect('/tweets')
      }

      if (followship) {
        req.flash('error_messages', '不得重複追蹤')
        return res.status(400).redirect('back')
      } else {
        await Followship.create({
          followerId,
          followingId
        })
        req.flash('success_messages', '成功追蹤')
        return res.json([{
          status: 'success', message: 'restaurant was successfully created'
        }
        ])
      }
    }
    catch (err) {
      console.log(err)
    }
  },



}

module.exports = userController