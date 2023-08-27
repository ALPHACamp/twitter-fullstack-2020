const bcrypt = require('bcryptjs')
const { Op } = require('sequelize');
const { User } = require('../models')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.checkPassword) throw new Error('密碼不一致!')
    if (req.body.name.length > 50) throw new Error('字數超出上限！')

    return User.findOne({
      where: {
        [Op.or]: [
          { email: req.body.email },
          { account: req.body.account }
        ]
      }
    })
      .then(user => {
        if (user) {
          if (user.toJSON().email === req.body.email) throw new Error('email 已重複註冊！')
          if (user.toJSON().account === req.body.account) throw new Error('account 已重複註冊！')
        }
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        account: req.body.account,
        role: 'user'
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊！')
        return res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },
  adminSignInPage: (req, res) => {
    return res.render('admin/signin')
  },
  adminSignIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },
  getUserSetting: (req, res, next) => {
    return res.render('user-setting')
  },
  getUserFollowings: (req, res, next) => {
    return res.render('followings')
  },
  getUserFollowers: (req, res, next) => {
    return res.render('followers')
  },  logout: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('/signin')
  },
  getUserTweets: (req, res, next) => {
    res.render('user-tweets')
  },
  getUserReplies: (req, res, next) => {
    res.render('user-replies')
  },
  getUserLikes: (req, res, next) => {
    res.render('user-likes')
  }
}

module.exports = userController