const bcrypt = require('bcryptjs')
const db = require('../models')
const tweetController = require('./tweetController')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Followship = db.Followship
const helpers = require('../_helpers')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.checkPassword !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同，請重新填寫')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', 'email重複!')
          return res.redirect('/signup')
        } else {
          User.findOne({ where: { account: req.body.account } }).then(user => {
            if (user) {
              req.flash('error_messages', '帳號重複!')
              return res.redirect('/signup')
            } else {
              User.create({
                email: req.body.email,
                name: req.body.name,
                account: req.body.account,
                role: 'user',
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
              }).then(() => {
                return res.redirect('/signin')
              })
            }
          })
        }
      })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    console.log(req.user.role)
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },

  signOut: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('/signin')
  },

  getUserTweets: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: Tweet, as: 'LikedTweets' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ], order: [[Tweet, 'createdAt', 'DESC']]
    }).then(user => {
      const pageUser = user.toJSON()
      const currentUserId = helpers.getUser(req).id
      pageUser.isFollowed = helpers.getUser(req).Followers.map(item => item.id).includes(user.id)

      // // 不確定能否撈到 tweet 資料
      // pageUser.Tweets.forEach(tweet => {
      //   tweet.isLiked = tweet.Likes.map(item => item.id).includes(currentUserId)
      // })

      return res.render('user/userPage', {
        user: pageUser,
        currentUserId
      })
    })
  },

  getUserLikes: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: like, include: [{ model: Tweet, include: User }] },
        { model: Tweet, as: 'LikedTweets' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ], order: [[LikedTweets, 'createdAt', 'DESC']]
    }).then(user => {
      const pageUser = user.toJSON()
      const currentUserId = helpers.getUser(req).id
      pageUser.isFollowed = helpers.getUser(req).Followers.map(item => item.id).includes(currentUserId)

      // 缺少 like 清單

      return res.render('user/userLikesPage')
    })
  }

}

module.exports = userController