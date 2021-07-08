const bcrypt = require('bcryptjs')
const { User, Tweet } = require('../models')
const { Op } = require('sequelize')

const adminController = {
  getTweets: (req, res) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [['createdAt', 'desc']]
    }).then(tweets => {
      tweets = tweets.map(t => ({
        ...t,
        content: t.content.substring(0, 50)
      }))
      return res.render('admin/tweets', { tweets })
    })
  },
  getUsers: (req, res) => {
    return res.render('admin/users')
  },
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },
  signUpPage: (req, res) => {
    const signup = true
    return res.render('admin/signin', { signup })
  },
  signUp: (req, res) => {
    const { name, account, email, password, passwordConfirm } = req.body
    const errors = []
    if (!name || !account || !email || !password || !passwordConfirm) {
      errors.push({ msg: '所有欄位都是必填。' })
    }
    if (password !== passwordConfirm) {
      errors.push({ msg: '密碼及確認密碼不一致！' })
    }
    if (errors.length) {
      return res.render('signup', {
        errors, name, account, email, password, passwordConfirm
      })
    }
    User.findOne({
      where: {
        [Op.or]: [{ account }, { email }]
      }
    }).then(user => {
      if (user) {
        errors.push({ msg: '帳號或Email已註冊！' })
        return res.render('signup', {
          errors, name, account, email, password, passwordConfirm
        })
      }
      return User.create({
        name, account, email,
        is_admin: true,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      }).then(() => {
        req.flash('success_messages', '成功新增管理員！')
        return res.redirect('/admin/users')
      })
    })
  },
  signOut: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('/admin/signin')
  }
}

module.exports = adminController