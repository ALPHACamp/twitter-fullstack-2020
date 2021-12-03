const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const helpers = require('../_helpers')

const userController = {
  //註冊頁面
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.checkPassword !== req.body.password) {
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
              account: req.body.account,
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
              role: 'user'
            })
              .then(user => {
                req.flash('success_messages', '成功註冊帳號！')
                return res.redirect('/signin')
              })
          }
        })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_msg', '成功登入！')
    res.redirect('/tweets')
  },

  editPage: (req, res) => {
    return User.findByPk(helpers.getUser(req).id)
      .then((user) => {
        res.render('edit', { user: user.toJSON() })
      })
  },

  editData: (req, res) => {
    const { name, email, password, checkPassword } = req.body
    const currentUser = helpers.getUser(req)
    if (!email || !name || !password || !checkPassword) {
      req.flash('error_msg', '所有欄位皆為必填')
      return res.redirect('back')
    }

    if (checkPassword !== password) {
      req.flash('error_msg', '兩次密碼輸入不同！')
      return res.redirect('back')
    }
    if (email !== currentUser.email) {
      return User.findOne({ where: { email: email }})
        .then((user) => {
          if (user) {
            req.flash('error_msg', '信箱已存在')
            return res.redirect('back')
          }
        })
    }
    if (account !== currentUser.account) {
      return User.findOne({ where: { account: account } })
        .then((user) => {
          if (user) {
            req.flash('error_msg', '帳號已存在')
            return res.redirect('back')
          }
        })
    }
    return User.findByPk(currentUser.id)
      .then((user) => {
        user.update({
          name: name,
          account: account,
          email: email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
        })
        return res.redirect('/tweets')
      })
  },


  logout: (req, res) => {
    req.flash('success_msg', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }

  
}

module.exports = userController