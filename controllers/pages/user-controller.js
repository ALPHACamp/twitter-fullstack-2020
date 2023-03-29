const { User, Tweet, Reply, Followship, Like } = require('../../models')
const bcrypt = require('bcryptjs') //載入 bcrypt
const dateFormatter = require('../../helpers/dateFormatter')
const helpers = require('../../_helpers')
const userController = {
  registPage: (req, res) => {
    res.render('regist', { layout: false })
  },
  regist: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email已被註冊！')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/login', { layout: false })
      })
      .catch(err => next(err))
  }, // 新增以下程式碼
  logInPage: (req, res) => {
    res.render('login', { layout: false })
  },
  logIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/login', { layout: false })
  },

  getUserTweets: async (req, res, next) => {
    try {
      const user = await User.findByPk(helpers.getUser(req).id, {
        include: {
          model: Tweet,
          include: [{ model: Reply }, { model: User }, { model: User, as: 'LikedUsers' }],
        },
        order: [[{ model: Tweet }, 'createdAt', 'DESC']],
        nest: true
      })
      const userTweets = user.toJSON().Tweets.map(tweet => ({
        ...tweet,
        replyCount: tweet.Replies.length,
        likeCount: tweet.LikedUsers.length,
        isLiked: tweet.LikedUsers.some(lu => lu.id === helpers.getUser(req).id)
      }))


      userTweets.forEach(tweet => {
        dateFormatter(tweet, 8)
      })
      res.render('user-profile', { tweets: userTweets, isTweets: true, isProfile: true })
    } catch (error) {
      console.log(error)
    }
  },

  getUserReplies: async (req, res, next) => {
    try {
      const user = await User.findByPk(helpers.getUser(req).id, {
        include: {
          model: Reply,
          include: [
            {
              model: Tweet,
              include: { model: User }
            },
            { model: User }
          ],
        },
        order: [[{ model: Reply }, 'createdAt', 'DESC']],
        nest: true
      })
      const userReplies = user.toJSON().Replies
      userReplies.forEach(reply => {
        dateFormatter(reply, 8)
      })
      res.render('user-profile', { replies: userReplies, isReplies: true, isProfile: true })
    } catch (error) {
      console.log(error)
    }
  },

  getUserLikes: async (req, res, next) => {
    try {
      const user = await User.findByPk(helpers.getUser(req).id, {
        include: {
          model: Tweet,
          as: 'LikedTweets',
          include: [{ model: Reply }, { model: User }, { model: User, as: 'LikedUsers' }],
        },
        order: [[{ model: Tweet, as: 'LikedTweets' }, 'createdAt', 'DESC']],
        nest: true
      })
      const likedTweets = user.toJSON().LikedTweets.map(tweet => ({
        ...tweet,
        replyCount: tweet.Replies.length,
        likeCount: tweet.LikedUsers.length,
        isLiked: true
      }))

      likedTweets.forEach(reply => {
        dateFormatter(reply, 8)
      })

      res.render('user-profile', { tweets: likedTweets, isLikes: true, isProfile: true })
    } catch (error) {
      console.log(error)
    }
  }
}
module.exports = userController
