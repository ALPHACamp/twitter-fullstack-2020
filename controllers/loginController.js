const db = require('../models')
const Op = db.Sequelize.Op
const User = db.User
const bcrypt = require('bcryptjs')
const emailVerify = require('../public/javascripts/emailValidate')

const loginController = {
  signupPage: (req, res) => {
    return res.status(200).render('signupForm', { layout: 'form' })
  },

  signupAccountCheck: async (req, res) => {
    const userAccount = req.params.account
    const user = await User.findOne({ raw: true, where: { account: userAccount } })
    if (user) {
      return res.json('false')
    } else {
      return res.json('true')
    }
  },

  signUp: async (req, res) => {
    let signupData = req.body
    let errors = []
    if (!signupData.account) {
      errors.push({ msg: '帳號不可為空' })
    }
    if (!signupData.name) {
      errors.push({ msg: '名字不可為空' })
    }
    if (!emailVerify(signupData.email)) {
      errors.push({ msg: '郵件格式不符合' })
    }
    if (!(signupData.password === signupData.checkPassword)) {
      errors.push({ msg: '兩次密碼輸入不符合' })
    }

    if (errors.length) {
      return res.render('signupForm', { layout: 'form', errors, signupData })
    } else {
      const user = await User.findOne({ raw: true, 
        where: { [Op.or]: [
          { account: signupData.account },
          { email: signupData.email }
        ] }
      })
      if (user && user.account === signupData.account) {
        errors.push({ msg: '此帳號已經有人使用' })
      }
      if (user && user.email === signupData.email) {
        errors.push({ msg: '此電子郵箱已經有人使用' })
      }
      if (errors.length) {
        res.render('signupForm', { layout: 'form', errors, signupData })
      } else {
        signupData.password = bcrypt.hashSync(signupData.password, bcrypt.genSaltSync(10))
        await User.create(signupData)
        req.flash('success_messages', `Hi, ${signupData.account} 歡迎加入`)
        res.redirect('/signin')
      }
    }
  },

  signinPage: (req, res) => {
    return res.status(200).render('signinForm', { layout: 'form' })
  },

  signIn: (req, res) => {
    res.redirect('/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = loginController