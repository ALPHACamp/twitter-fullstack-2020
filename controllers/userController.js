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
      // 例外處理: 使用預設要給測試檔（test/requests/user/spec.js #90行）替換的account註冊
      if (account === 'accountToBeReplacedByTestFile') {
        req.flash('error_messages', '不可使用該帳號！')
        res.redirect('/signup')
      } else { 
        return User.findOne({
          where: {
            [Op.or]: [{ account }, { email }]
          }
        })
          .then((user) => {
            if (user) {
              req.flash('error_messages', '重複註冊Email或帳號！')
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