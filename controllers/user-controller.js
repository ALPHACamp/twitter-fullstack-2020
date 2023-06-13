const { User, Like } = require('../models')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    const { account, name, email, password, passwordCheck } = req.body
    if (!account || !name || !email || !password || !passwordCheck) {
      req.flash('error_message', '所有欄位都是必填')
      return req.redirect('/signup')
    }

    if (req.body.password !== req.body.passwordCheck) {
      req.flash('error_message', '密碼不相符')
      return req.redirect('/signup')
    }

    Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { name } })
    ])
      .then(([account, name]) => {
        if (account) throw new Error('account 已重複註冊！')
        if (name) throw new Error('name 已重複註冊！')

        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash,
        isAdmin: false
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        return res.redirect('/signin')
      })
      .catch(err => {
        req.flash('error_message', `${err}`)
        return req.redirect('/signup')
      })
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_message', '成功登入')
    res.redirect('/tweets')
  },
  logOut: (req, res) => {
    req.flash('success_messages', '登出成功')
    req.logOut(() => { })
    res.redirect('/signin')
  },
  settingPage: (req, res) => {
    res.render('setting')
  },
  addLike: (req, res, next) => { // 喜歡
    return Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.TweetId
    })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => { // 不喜歡
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.TweetId
      }
    })
      .then(like => {
        if (!like) throw new Error("You haven't Liked this tweet!")
        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = userController
