const db = require('../models')
const Followship = db.Followship
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')

const userService = require('../services/userService')

const userController = {
  getUserTweets: async (req, res) => {
    try {
      const userId = req.params.userId

      const popularUser = await userService.getPopular(req, res)
      const profileUser = await userService.getProfileUser(req, res)

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

      res.render('userTweets', {status: (200), profileUser, popularUser, tweets })
    } catch (err) {
      res.status(302)
      req.flash('error_messages', '讀取使用者貼文失敗')
      return res.redirect('/')
      
    }
  },
  getSetting: async (req, res) => {
    try {
      User.findByPk(helpers.getUser(req).id, { raw: true }).then(user => {
        res.render('setting', { userdata: user })

      })
    } catch (error) {
      res.status(302)
      req.flash('error_messages', '讀取設定頁面失敗')
      return res.redirect('back')
    }
  },

  editSetting: async (req, res, next) => {
    try {
      const user = req.user
      const userId = req.user.id
      const { name, account, email, password, checkPassword } = req.body
      const error_messages = []

      if (checkPassword !== password) {
        error_messages.push({ message: '密碼與確認密碼不符！' })
      }
      // 確認沒有相同帳號的使用者
      let sameUser = await User.findOne({ where: { account } })
      if (sameUser && sameUser.dataValues.id !== userId) {
        error_messages.push({ message: '此帳號已註冊。' })
      }
      // 確認沒有相同 email 的使用者
      sameUser = await User.findOne({ where: { email } })
      if (sameUser && sameUser.dataValues.id !== userId) {
        error_messages.push({ message: '此 Email 已經存在。' })
      }

      if (error_messages.length) {
        return res.render('setting', {status: (302), error_messages, account, userdata: user,})}

      await User.findByPk(userId).then(user => {
        user.update({
          account,
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        })
        return res.render('setting', {
          status: 200,
          success_messages: '成功修改帳戶資料',
          userdata: user
        })
      })
    } catch (err) {
      res.status(302);
      req.flash('error_messages', '帳戶更動失敗')
      return res.redirect('back')
    }
  },

  getReplies: async (req, res) => {
    try {
      const userId = req.params.userId
      const popularUser = await userService.getPopular(req, res)
      const profileUser = await userService.getProfileUser(req, res)

      const replies = await Reply.findAll({
        where: { UserId: userId },
        include: [
          {
            model: Tweet,
            attributes: ['id'],
            include: [{ model: User, attributes: ['id', 'account'] }]
          }
        ],
        order: [['createdAt', 'DESC']]
      })

      res.render('userReply', {status: (200), profileUser, popularUser, replies })
    } catch (err) {
      res.status(302);
      req.flash('error_messages', '讀取回覆失敗')
      return res.redirect('back')
    }
  },
  getLikes: async (req, res) => {
    try {
      const userId = req.params.userId
      const popularUser = await userService.getPopular(req, res)
      const profileUser = await userService.getProfileUser(req, res)

      const likedTweetsRaw = await Like.findAll({
        where: { UserId: userId },
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Tweet,
            attributes: ['description', 'createdAt', 'id'],
            include: [User, Like, Reply]
          }
        ]
      })
      const likedTweets = likedTweetsRaw.map(like => ({
        ...like.dataValues,
        replyLength: like.Tweet.Replies.length,
        likeLength: like.Tweet.Likes.length,
        isLiked: helpers.getUser(req).LikedTweets
          ? helpers
              .getUser(req)
              .LikedTweets.map(likeTweet => likeTweet.id)
              .includes(like.Tweet.id)
          : true // 為了測試檔而新增的
      }))

      res.render('userLike', { status: (200), profileUser, popularUser, likedTweets })
    } catch (err) {
      res.status(302);
      req.flash('error_messages', '點擊失敗')
      return res.redirect('back')
    }
  },

  getFollowings: async (req, res) => {
    try {
      const popularUser = await userService.getPopular(req, res)

      const followings = await User.findByPk(req.params.userId, {
        include: [
          { model: User, as: 'Followings' },
          { model: Tweet, attributes: ['id'] }
        ],
        order: [['createdAt', 'DESC']]
      })
      const currentUserFollowings = followings.toJSON()

      let followingsUser = currentUserFollowings.Followings.map(item => ({
        id: item.id,
        name: item.name,
        account: item.account,
        avatar: item.avatar,
        introduction: item.introduction,
        followshipId: item.Followship.id, //做follow排序
        isFollowed: helpers
          .getUser(req)
          .Followings.map(d => d.id)
          .includes(item.id)
      }))

      return res.render('following', {
        popularUser,
        currentUserFollowings,
        followingsUser
      })
    } catch (err) {
      res.status(302);
      req.flash('error_messages', '獲取追蹤中使用者失敗')
      return res.redirect('back')
    }
  },

  getFollowers: async (req, res) => {
    try {
      // userId 為當前profile頁面的user的id
      const popularUser = await userService.getPopular(req, res)

      const followers = await User.findByPk(req.params.userId, {
        include: [
          { model: User, as: 'Followers' },
          { model: Tweet, attributes: ['id'] }
        ],
        order: [['createdAt', 'DESC']]
      })
      const currentUserFollowers = followers.toJSON()

      let followersUser = currentUserFollowers.Followers.map(item => ({
        id: item.id,
        name: item.name,
        account: item.account,
        avatar: item.avatar,
        introduction: item.introduction,
        followshipId: item.Followship.id, //做follow排序
        isFollowed: helpers
          .getUser(req)
          .Followings.map(d => d.id)
          .includes(item.id)
      }))

      return res.render('follower', {
        popularUser,
        currentUserFollowers,
        followersUser
      })
    } catch (err) {
      res.status(302);
      req.flash('error_messages', '獲取追蹤者失敗')
      return res.redirect('back')
    }
  }
}

module.exports = userController
