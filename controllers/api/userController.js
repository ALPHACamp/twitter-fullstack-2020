const fs = require('fs')
const db = require('../../models')
const { User, Tweet, Reply, Like } = db
const helpers = require('../../_helpers')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

let userController = {
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
      req.flash('error_messages', '獲取使用者失敗！')
      res.status(302)
      return res.redirect('back')
    }
  },

  putUser: async (req, res) => {
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

      const tweets = tweetsRaw.map((tweet) => ({
        ...tweet.dataValues,
        replyLength: tweet.Replies.length,
        likeLength: tweet.Likes.length,
        isLiked: helpers.getUser(req).LikedTweets
          ? helpers
              .getUser(req)
              .LikedTweets.map((likeTweet) => likeTweet.id)
              .includes(tweet.id)
          : false
      }))

      const uploadImgur = (path) => {
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

      profileUser.name = userUpload.name
      profileUser.introduction = userUpload.intro
      profileUser.cover = userUpload.cover
        ? userUpload.cover.data.link
        : user.cover
      profileUser.avatar = userUpload.avatar
        ? userUpload.avatar.data.link
        : user.avatar

      // 此處選擇不redirect是為了符合測試檔中規定回傳status code 200 (不行302) 而進行的調整
      return res.render('userTweets', { profileUser, popularUser, tweets })
    } catch (err) {
      req.flash('error_messages', '更新失敗！')
      res.status(302)
      return res.redirect('back')
    }
  },
}

module.exports = userController
