const imgur = require('imgur-node-api')
const db = require('../../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const helpers = require('../../_helpers')

const fs = require('fs')
const user = require('../../models/user')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userService = require('../../services/userService')

const userController = {
  getUser: async (req, res) => {
    const userId = req.params.userId
    const id = helpers.getUser(req).id
    if (Number(userId) !== Number(id)) {
      req.flash('error_messages', '只能更改自己的profile')
      return res.status(200).json({ status: 'error' })
    }
    try {
      const user = await User.findByPk(id, {
        attributes: ['cover', 'avatar', 'name', 'introduction']
      })

      const { cover, avatar, name, introduction } = user

      return res.status(200).json({ cover, avatar, name, introduction })
    } catch (err) {
      console.log(err)
    }
  },
  editUser: async (req, res) => {
    const userId = req.params.userId
    const id = helpers.getUser(req).id
    const { files } = req
    const userUpload = {}
    const popularUser = await userService.getPopular(req, res)
    const profileUser = await userService.getProfileUser(req, res)

    userUpload.name = req.body.name
    userUpload.intro = req.body.intro

    try {
      const tweetsRaw = await Tweet.findAll({
        where: { UserId: userId },
        include: [Reply, Like],
        order: [['createdAt', 'DESC']]
      })

      const tweets = tweetsRaw.map(tweet => ({
        ...tweet.dataValues,
        replyLength: tweet.Replies.length,
        likeLength: tweet.Likes.length,
        isLiked: helpers.getUser(req).LikedTweets
          ? helpers
              .getUser(req)
              .LikedTweets.map(likeTweet => likeTweet.id)
              .includes(tweet.id)
          : false
      }))

      const uploadImgur = path => {
        return new Promise((resolve, reject) => {
          imgur.upload(path, (err, img) => {
            if (err) {
              return reject(err)
            }
            resolve(img)
          })
        })
      }

      if (Number(userId) !== Number(id)) {
        req.flash('error_messages', '只能更改自己的profile')
        res.redirect('/tweets')
      }

      if (files) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        for (const file in files) {
          userUpload[file] = await uploadImgur(files[file][0].path)
        }
      }

      const user = await User.findByPk(id)
      user.update({
        name: userUpload.name,
        introduction: userUpload.intro,
        cover: userUpload.cover ? userUpload.cover.data.link : user.cover,
        avatar: userUpload.avatar ? userUpload.avatar.data.link : user.avatar
      })

      return res.render('userTweets', { profileUser, popularUser, tweets })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = userController
