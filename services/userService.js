const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const bcrypt = require('bcryptjs')
const { Op } = require("sequelize")
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const helpers = require('../_helpers')

const userService = {
  getUserTweets: (req, res, callback) => {
    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
    const currentUser = helpers.getUser(req).id
    return Promise.all([
      Tweet.findAll({
        where: { UserId: req.params.id },
        include: [User, Reply, { model: User, as: 'LikedUsers' }],
        order: [['createdAt', 'DESC']]
      }),
      Followship.count({
        where: { followingId: req.params.id }
      }),
      Followship.count({
        where: { followerId: req.params.id }
      }),
      User.findByPk(
        req.params.id
      ),
      User.findAll({
        include: [
          Tweet,
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ],
        where: { role: "user" }
      })
    ]).then(([tweets, followersCount, followingsCount, tweetUser, users]) => {
      const data = tweets.map(tweet => ({
        ...tweet.dataValues,
        isLiked: tweet.LikedUsers.map(d => d.id).includes(helpers.getUser(req).id),
      }))
      const topUsers = users.map(user => ({
        ...user.dataValues,
        followerCount: user.Followers.length,
        isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
      }))
        .sort((a, b) => b.followerCount - a.followerCount)
        .slice(0, 10)
      return callback({
        tweets: data,
        tweetUser: tweetUser.toJSON(),
        followersCount,
        followingsCount,
        topUsers,
        currentUser,
        BASE_URL
      })
    })
      .catch(err => console.log(err))
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

    if (!name.trim('')) {
      return callback({ status: error, message: '請輸入有效名稱！' })
    } else if (name.trim('').length > 50) {
      return callback({ status: error, message: '名稱不得超過50字！' })
    }

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