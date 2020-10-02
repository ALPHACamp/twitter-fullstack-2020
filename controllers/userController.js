const bcrypt = require('bcryptjs')
const { Sequelize } = require('../models')
const db = require('../models')
const user = require('../models/user')
const User = db.User
const Op = Sequelize.Op

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    console.log(req.body)

    if (req.body.password !== req.body.passwordCheck) {
      req.flash('error_messages', '兩次密碼輸入不同')
      return res.redirect('/signup')
    } else {
      User.findOne({
        where: { [Op.or]: [{ email: req.body.email }, { account: req.body.account }] }, raw: true
      }).then(user => {
        if (user) {
          if (user.email === req.body.email) { req.flash('error_messages', '此email已經被註冊') }
          if (user.account === req.body.account) { req.flash('error_messages', '此account已經被註冊') }
          return res.redirect('/signup')
        } else {
          return User.create({
            name: req.body.name,
            account: req.body.account,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))  //salt = bcrypt.genSaltSync(10)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號!')
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
    req.flash('success_messages', "成功登入！")
    res.redirect('/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '成功登出!')
    req.logout()
    res.redirect('/signin')
  },

  getSetting: (req, res) => {
    return res.render('setting')
  },

  putSetting: (req, res) => {

    if (!req.body.name) {
      req.flash('error_messages', 'name did not exist')
      return res.redirect('/')
    }

    if (req.body.password !== req.body.passwordCheck) {
      req.flash('error_messages', '兩次密碼輸入不同')
      return res.redirect('back')
    }

    return User.findByPk(req.user.id)
      .then((user) => {
        user.update({
          name: req.body.name,
          email: req.body.email,
          account: req.body.account,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
        })
      }).then(user => {
        console.log("updated!")
        req.flash('success_messages', '資料已被更新!')
        res.redirect('/')
      })

  }


}

module.exports = userController