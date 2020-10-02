const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Like = db.Like
const Followship = db.Followship

const userController = {
  registerPage: (req, res) => {
    return res.render('register', { layout: 'mainLogin' })
  },
  register: (req, res) => {
    if (req.body.confirmPassword !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/users/register')
    } else {
      // confirm unique user
      User.findOne({
        where: {
          $or: [
            { email: req.body.email },
            { account: req.body.account }
          ]
        }
      })
        .then(user => {
          if (user) {
            req.flash('error_messages', '信箱或賬號重複！')
            return res.redirect('/users/register')
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              account: req.body.account,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
              role: 'user'
            }).then(user => {
              req.flash('success_messages', '成功註冊帳號！')
              return res.redirect('/users/login')
            })
          }
        })
    }
  },
  loginPage: (req, res) => {
    return res.render('login', { layout: 'mainLogin' })
  },
  login: (req, res) => {
    req.flash('success_messages', '成功登入！')
    return res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    return res.redirect('/users/login')
  },

  likeTweet: (req, res) => {
    Like.create({
      UserId: req.user.id,
      TweetId: req.params.tweetId
    })
    .then(like => {
      return res.redirect('back')
    })
  },

  dislikeTweet: (req, res) => {
    Like.findOne({
      where: {
        UserId: req.user.id,
        TweetId: req.params.tweetId
      }
    })
    .then(like => {
      like.destroy()
        .then(like => {
          return res.redirect('back')
        })
    })  
  },

  likeReply: (req, res) => {
    Like.create({
          UserId: req.user.id,
          ReplyId: req.params.replyId
    })
    .then(like => {
      return res.redirect('back')
    })
  },

  dislikeReply: (req, res) => {
    Like.findOne({
      where: {
        UserId: req.user.id,
        ReplyId: req.params.replyId
      }
    })
    .then(like => {
      like.destroy()
        .then(like => {
          return res.redirect('back')
        })   
    })
  },

  postFollowing: (req, res) => {
    Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
    .then(followship => {
      return res.redirect('/tweets')
    })
  },

  deleteFollowing: (req, res) => {
    Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
    .then(followship => {
      followship.destroy()
        .then(followship => {
          return res.redirect('/tweets')
        })
    })
  }
}

module.exports = userController