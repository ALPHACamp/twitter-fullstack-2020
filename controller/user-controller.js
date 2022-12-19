const { User, Tweet, Reply, Like, Followship } = require('../models')
const bcrypt = require('bcryptjs')
const { getUser } = require('../_helpers')

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
    //使用sequelize operator or，來選擇搜尋兩樣東西。
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
  //註冊修改頁面
  editSetting: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return res.render('setting', { user })
      })
      .catch(err => next(err))
  },
  //帳戶註冊頁面修改,尚未完成，輸入對象有問題。
  putSetting: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('密碼不相符!ヽ(#`Д´)ﾉ')
    if (name.length > 50) throw new Error('字數超出上限ヽ(#`Д´)ﾉ')
    return User.findByPk(req.params.id)
      .then(async (user) => {
        const usedPassword = await bcrypt.compare(password, user.password)
        if (!user) throw new Error("User didn't exist!")
        console.log(user.email)
        if (usedPassword) throw new Error("Reset!")
        bcrypt.hash(password, 10)
      })
      .then(hash => {
        // user.update({
        //   account, name, email, password: hash
        // })
        console.log(hash)
      })
      .then(() => {
        req.flash('success_messages', '帳戶資訊已更新')
        res.redirect('/tweets')
      })
      .catch(err => next(err))
    // name字數限制，account不能重複。
    // 比對是否跟上次的密碼是否重複
    // 比對兩次密碼是否重複
    // 修改成功資訊
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
  },
  //我用來測試畫面的
  getTweets: (req, res) => {
    res.render('tweets')
  },
  getSetting: (req, res) => {
    res.render('setting')
  },
  getPerson: (req, res) => {
    res.render('personal-page')
  },
  reply: (req, res) => {
    res.render('replies')
  },
  getFollower: (req, res) => {
    res.render('followings')
  },
  getTweet: (req, res) => {
    res.render('tweet')
  }
}



module.exports = userController
