const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const db = require('../models')

const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Followship = db.Followship

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    if (req.body.password !== req.body.passwordCheck) {
      req.flash('error_messages', '密碼與檢查密碼不一致！')
      res.redirect('/signup')
    } else {
      return User.findOne({ where: { email: req.body.email } })
        .then((user) => {
          if (user) {
            req.flash('error_messages', '這個Email已經註冊過！')
            res.redirect('/signup')
          } else {
            req.flash('success_messages', '註冊成功!')
            return User.create({
              account: req.body.account,
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            })
              .then(user => { res.redirect('/signin') })
          }
        })  
        }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  // like tweet
  addLike: (req,res) => {
    return Like.create({
      UserId: helpers.getUser(req).id ,
      TweetId: req.params.tweetId
    })
      .then(tweet => {
        return res.redirect('back')
      })
  },
  // unlike tweet
  removeLike: (req, res) => {
    return Like.destroy({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweetId
      }
    })
      .then(tweet => {
        return res.redirect('back')
      })
  },
  // following
  addFollowing: (req, res) => {
    // 目前的登入者不行追蹤自己
    console.log('********')
    console.log('req.params.followingId:' ,req.params.followingId)
    console.log('********')
    console.log('req.user.id:', req.user.id)
    console.log('********')
    const myId = Number(req.params.followingId)
    if (helpers.getUser(req).id === myId) {
      req.flash('error_messages', '幹嘛? 不要給我追蹤自己喔')
      return res.redirect('back')
    }
    return Followship.create({
      // 目前登入的使用者id
      followerId: helpers.getUser(req).id,
      // 我要追蹤的使用者id
      followingId: req.params.followingId
    })
      .then( followship => {
        return res.redirect('back')
      })
  },
  // removeFollowing
  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.followingId
      }
    })
      .then(followship => {
        followship.destroy()
          .then(followship => {
            return res.redirect('back')
          })
      })
  },
}

module.exports = userController