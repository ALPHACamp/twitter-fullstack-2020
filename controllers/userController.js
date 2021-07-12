const bcrypt = require('bcryptjs')
const db = require('../models')
const userService = require('../services/userService')
const User = db.User
const Like = db.Like
const Tweet = db.Tweet


const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.confirmedPassword !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    }

    User.findOne({ where: { email: req.body.email } }).then(user => {
      if (user) {
        req.flash('error_messages', '信箱重複！')
        return res.redirect('/signup')
      } else {
        User.create({
          account: req.body.account,
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
        }).then(user => {
          req.flash('success_messages', '成功註冊帳號！')
          return res.redirect('/signin')
        })
      }
    })

  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },

  signOut: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  userPage: (req, res) => {
    userService.getUserTweets(req, res, (data) => {
      return res.render('users', data)
    })
  },

  userPageReplies: (req, res) => {
    userService.getUserReplies(req, res, (data) => {
      return res.render('users-replies', data)
    })
  },

  userPageLikes: (req, res) => {
    userService.getUserLikes(req, res, (data) => {
      return res.render('users-liked', data)
    })
  },

  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      TweetId: req.params.tweetId
    })
      .then((tweet) => {
        return res.redirect('back')
      })
  },

  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        TweetId: req.params.tweetId,
      }
    })
      .then((like) => {
        like.destroy()
          .then((tweet) => {
            return res.redirect('back')
          })
      })
  },

  getUserSetting: async (req, res) => {
    const isMySelf = req.user.id.toString() === req.params.id.toString()
    if (!isMySelf) {
      req.flash('error_messages', 'you can only edit your own profile!')
    }
    const user = await User.findByPk(req.params.id)
    return res.render('userSetting', { user: user.toJSON() })
  }
}


module.exports = userController
