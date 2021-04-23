const fs = require('fs')
const helpers = require('../_helpers')
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

let userController = {
  loginPage: (req, res) => {
    return res.render('login')
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
    return res.render('setting')
  },
  getUser: async (req, res) => {

    const result = await Tweet.findAndCountAll({
      raw: true,
      nest: true,
      where: {
        userId: req.params.id
      },
      distinct: true,
    })
    const tweets = result.rows
    return User.findByPk(req.params.id)
      .then(user => {
        console.log(user)
        res.render('profile', {
          user: user, tweets
        })
      })
  },


}

module.exports = userController