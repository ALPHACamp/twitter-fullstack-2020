const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const bcrypt = require('bcryptjs')
const sequelize = require("sequelize")
const { Op } = require("sequelize")
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const helpers = require('../_helpers')

const userService = {
  getUserTweets: async (req, res, callback) => {
    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

    const tweets = await Tweet.findAll({
      where: { UserId: req.params.id },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'avatar', 'account']
        },
        { model: Like },
        { model: Reply }
      ],
      order: [['createdAt', 'DESC'],
      ]
    })

    const user = await User.findOne({
      where: { id: req.params.id },
      include: [
        { model: Tweet },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })

    const users = await Followship.findAll({
      attributes: [
        'followingId', [sequelize.fn('COUNT', sequelize.col('followingId')), 'count']
      ],
      include: [
        { model: User, as: 'FollowingLinks' },
      ],
      group: ['followingId'],
      order: [[sequelize.col('count'), 'DESC']],
      limit: 10
    })

    const currentUser = helpers.getUser(req)
    const topUsers = users.map(user => ({
      id: user.FollowingLinks.id,
      name: user.FollowingLinks.name ? (user.FollowingLinks.name.length > 12 ? user.FollowingLinks.name.substring(0, 12) + '...' : user.FollowingLinks.name) : 'noName',
      account: user.FollowingLinks.account ? (user.FollowingLinks.account.length > 12 ? user.FollowingLinks.account.substring(0, 12) + '..' : user.FollowingLinks.account) : 'noAccount',
      avatar: user.FollowingLinks.avatar,
      followerCount: user.count,
      isFollowed: currentUser.Followings.map((d) => d.id).includes(user.FollowingLinks.id),
      isSelf: Boolean(user.FollowingLinks.id === currentUser.id)
    }))
    console.log(currentUser)

    return callback({ tweets, user, currentUser, topUsers, BASE_URL })
  },
  renderUserProfileEdit: (req, res, callback) => {
    const currentUser = helpers.getUser(req)
    return User.findOne({
      where: { id: req.params.id },
      include: [
        { model: Tweet },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then((user) => {
        if (currentUser.id !== user.id) {
          return callback({ status: 'error', message: "無法編輯其他使用者資料！" })
        }
        callback({
          id: user.id,
          name: user.name,
          description: user.description,
          cover: user.cover,
          avatar: user.avatar,
        })
      })
      .catch(err => console.log(err))
  },

  putUserProfileEdit: async (req, res, callback) => {
    const user = await User.findByPk(req.params.id)
    const { name, description } = req.body
    const files = Object.assign({}, req.files)

    // if (!name.trim('')) {
    //   return callback({ status: error, message: '請輸入有效名稱！' })
    // } else if (name.trim('').length > 50) {
    //   return callback({ status: error, message: '名稱不得超過50字！' })
    // }

    imgur.setClientID(IMGUR_CLIENT_ID)

    if (files.avatar && files.cover) {
      imgur.upload(files.avatar[0].path, async (err, avaImg) => {
        imgur.upload(files.cover[0].path, async (err, covImg) => {
          await user.update({
            name: req.body.name,
            avatar: files.avatar[0] ? avaImg.data.link : user.avatar,
            cover: files.cover[0].path ? covImg.data.link : user.cover,
            description: req.body.description
          })
        })
      })
      callback({ status: success, message: "Your profile was successfully updated!" })
      res.redirect('back')
    } else if (files.avatar && !files.cover) {
      imgur.upload(files.avatar[0].path, async (err, avaImg) => {
        await user.update({
          name: req.body.name,
          avatar: files.avatar[0] ? avaImg.data.link : user.avatar,
          description: req.body.description
        })
      })
      callback({ status: 'success', message: "Your profile was successfully updated!" })
      res.redirect('back')
    } else if (!files.avatar && files.cover) {
      imgur.upload(files.cover[0].path, async (err, covImg) => {
        await user.update({
          name: req.body.name,
          cover: files.cover[0].path ? covImg.data.link : user.cover,
          description: req.body.description
        })
      })
      callback({ status: 'success', message: "Your profile was successfully updated!" })
      res.redirect('back')
    } else {
      await user.update({
        name: req.body.name,
        description: req.body.description
      })
      callback({ status: 'success', message: "Your profile was successfully updated!" })
      res.redirect('back')
    }
  },

  addFollowing: (req, res, callback) => {
    const followerId = helpers.getUser(req).id
    const followingId = req.body.id

    if (Number(followerId) === Number(followingId)) {
      callback({ status: 'error', message: 'You can\'t follow yourself!' })
      return res.end()
    }

    Followship.findAll({
      where: {
        followerId, followingId
      }
    }).then(followship => {
      if (followship.length) {
        callback({ status: 'error', message: 'You already followed this user' })
      } else {
        Followship.create({
          followerId,
          followingId
        })
        return callback({ status: 'success', message: '成功追蹤' })
      }
    })
  },
}

module.exports = userService