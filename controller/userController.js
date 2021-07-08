const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Followship = db.Followship
const Reply = db.Reply
const helpers = require('../_helpers')

const userController = {
  //註冊頁面
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  //註冊
  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            req.flash('error_messages', '信箱重複！')
            return res.redirect('/signup')
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            }).then(user => {
              req.flash('success_messages', '成功註冊帳號！')
              return res.redirect('/signin')
            })
          }
        })
    }
  },

  //登入頁面
  signInPage: (req, res) => {
    // console.log('這是登入頁面印的res.locals')
    // console.log(res.locals)
    if (res.locals.user) {
      // console.log('回到登入頁面如果res.locals.user存在就列印user')
      // console.log(res.locals.user)
      delete res.locals.user
      // console.log('刪除res.locals.user再列印user')
      // console.log(res.locals.user)
    }
    return res.render('signin')
  },

  //登入
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },

  //登出
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUserTweets: (req, res) => {
    const topFollowing = res.locals.data
    console.log(topFollowing)
    return User.findOne({
      where: {
        id: req.params.userId
      }
    }).then(user => {
      Followship.findAndCountAll({
        raw: true,
        nest: true,
        where: { followerId: user.id },
      }).then(following => {
        Followship.findAndCountAll({
          raw: true,
          nest: true,
          where: { followingId: user.id },
        }).then(follower => {
          Tweet.findAll({
            raw: true,
            nest: true,
            where: { userId: user.id },
          }).then(tweets => {
            return res.render('user/tweets', {
              user,
              followingCount: following.count,
              followerCount: follower.count,
              tweets,
              topFollowing
            })
          })
        })
      })
    })
  }
}
module.exports = userController