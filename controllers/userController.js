const bcrypt = require('bcryptjs')
const { Op } =require('sequelize')
const db = require('../models')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) {
      req.flash('error_messages', '密碼與檢查密碼不一致！')
      res.redirect('/signup')
    } else { 
        return User.findOne({
          where: {
            [Op.or]: [{ account }, { email }]
          }
        })
          .then((user) => {
            if (user) {
              if (user.account === account) { req.flash('error_messages', 'account 已重覆註冊！') }
              else { req.flash('error_messages', 'email 已重覆註冊！') }
              res.redirect('/signup')
            } else {
              req.flash('success_messages', '註冊成功!')
              return User.create({
                account,
                name,
                email,
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
  }
}

module.exports = userController