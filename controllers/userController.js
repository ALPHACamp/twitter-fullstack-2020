const fs = require('fs')
const helpers = require('../_helpers')
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const e = require('express')
const User = db.User
const Tweet = db.Tweet

let userController = {
  loginPage: (req, res) => {
    return res.render('login')
  },

  login: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/login')
  },


  registerPage: (req, res) => {
    return res.render('register')
  },
  userRegister: (req, res) => {
    if (req.body.confirmPassword !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/register')
    }
    else {
      // confirm unique account
      User.findOne({ where: { account: req.body.account } }).then(user => {
        if (user) {
          req.flash('error_messages', '帳號重複！')
          return res.redirect('/register')
        }
        else {
          // confirm unique user
          User.findOne({ where: { email: req.body.email } }).then(user => {
            if (user) {
              req.flash('error_messages', '信箱重複！')
              return res.redirect('/register')
            } else {
              User.create({
                account: req.body.account,
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
                image: null
              }).then(user => {
                req.flash('success_messages', '成功註冊帳號！')
                return res.redirect('/login')
              })
            }
          })
        }
      })
    }
  },

  settingPage: (req, res) => {
    if (helpers.getUser(req).id !== Number(req.params.id)) {
      return res.redirect('back')
    } else {
      return User.findByPk(req.params.id,{raw:true})
      .then(user => {
        return res.render('setting', {
          user: user
        })
      })
    }
  },
    putSetting: async(req,res) => {
    const id = req.params.id
    const { email: currentEmail, account: currentAccount } = helpers.getUser(req)
    const { account, name, email, password, confirmPassword } = req.body
    const error = []
    let newEmail = ''
    let newAccount = ''

    if (!account || !name || !email || !password || !confirmPassword) {
      error.push({ message: '所有欄位都是必填。' })
    }

    if (password !== confirmPassword) {
      error.push({ message: '密碼與確認密碼不一致！' })
    }

    if ( email !== currentEmail) {
      await User.findOne({ where: {email}}).then(user => {
        if (user) {
          error.push({ message: '信箱重複！'})
          return res.redirect('/users/:id/setting')
        } else {
          newEmail = email 
        }
      })
    }

    if ( email === currentEmail) {
      newEmail = email 
    }  

    if ( account !== currentAccount) {
      await User.findOne({ where: {account}}).then(user => {
        if (user) {
          error.push({ message: '帳號重複！'})
          return res.redirect('/users/:id/setting')
        } else {
          newAccount = account
        }
      })
    }

    if ( account === currentAccount) {
      newAccount = account
    }

    if (error.length !== 0 ) {
      return res.render('setting', {
        error
      })
    } 
    
    return User.findByPk(id)
      .then(user => user.update({ name, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)), email: newEmail, account: newAccount }))
      .then(() => {
        req.flash('success_messages', '用戶帳號資料更新成功！')
        res.redirect('/tweets')
      })    
    },  

  getUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        return res.render('profile', {
          user: user.toJSON()
        })
      })
  },
}

module.exports = userController