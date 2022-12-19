const { User, Tweet, Reply, Like, Followship } = require('../models')
const bcrypt = require('bcryptjs')

const userController = {
  signInPage: (req, res) => {
    res.render('signin')
  },
  //帳號密碼核對會在passport
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    // 使用req.flash會跳回signin
    // if (password !== checkPassword) req.flash('error_messages', '密碼不相符!ヽ(#`Д´)ﾉ')
    // if (name.length > 50) req.flash('error_messages', '字數超出上限ヽ(#`Д´)ﾉ')
    if (password !== checkPassword) throw new Error('密碼不相符!ヽ(#`Д´)ﾉ')
    if (name.length > 50) throw new Error('字數超出上限ヽ(#`Д´)ﾉ')
    //const { Op } = require('sequelize')
    //使用sequelize operator or，來選擇搜尋兩樣東西，我應該有成功?
    return Promise.all([User.findOne({ where: { email } }), User.findOne({ where: { account } })])
      .then(([email, account]) => {
        if (email) throw new Error('Email already exists!')
        if (account) throw new Error('account already exists!')
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        User.create({
          account, name, email, password: hash
        })
      })
      .then(() => {
        req.flash('success_messages', '帳號註冊成功!')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUserTweets: (req, res, next) => {
    const userId = req.params.id
    return Promise.all([
      User.findById(userId),
      Tweet.find({ where: { userId } }),
      Followship.find({ where: { userId } })
    ])
      .then(([user, tweets, followships]) => {
        console.log(user)
      })
  },
  getUserReplies: (req, res, next) => {
    const userId = req.params.id
    return Promise.all([
      User.findById(userId),
      Reply.find({ where: { userId } }),
      Followship.find({ where: { userId } })
    ])
      .then(([user, replies, followships]) => {
        console.log(user)
      })
  },
  getUserLikes: (req, res, next) => {
    const userId = req.params.id
    return Promise.all([
      User.findById(userId),
      Like.find({ where: { userId } }),
      Followship.find({ where: { userId } })
    ])
      .then(([user, likes, followships]) => {
        console.log(user)
      })
  },
  getUserPage: (req, res, next) => {
    res.render('personal-page')
  }
}
//我用來測試畫面的
// getTweets: (req, res) => {
//   res.render('followings')
// }



module.exports = userController
