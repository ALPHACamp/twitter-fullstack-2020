const bcrypt = require('bcrypt-nodejs')
const helpers = require('../_helpers')
const db = require('../models')
const { User, Tweet, Reply, Followship, Like } = db
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signupPage: (req, res) => {
    return res.render('signup')
  },

  signup: (req, res) => {
    if (req.body.checkPassword !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { account: req.body.account } }).then((user) => {
        if (user) {
          req.flash('error_messages', '帳號已重複註冊！')
          return res.redirect('/signup')
        } else {
          User.findOne({ where: { email: req.body.email } }).then((user) => {
            if (user) {
              req.flash('error_messages', '信箱已重複註冊！')
              return res.redirect('/signup')
            } else {
              User.create({
                account: req.body.account,
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(
                  req.body.password,
                  bcrypt.genSaltSync(10),
                  null
                )
              }).then((user) => {
                req.flash('success_messages', '成功註冊帳號！')
                return res.redirect('/signin')
              })
            }
          })
        }
      })
    }
  },

  signinPage: (req, res) => {
    return res.render('signin')
  },

  signin: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUserTweets: (req, res) => {
    return User.findByPk(req.params.id, {
      include: Tweet,
      order: [[Tweet, 'createdAt', 'DESC']]
    }).then((user) => {
      const users = user.toJSON()
      return res.render('user/userTweets', {
        users: users
      })
    })
  },

  editAccount: (req, res) => {
    return res.render('setting')
  },

  putAccount: async (req, res) => {
    const id = req.params.id
    const { email: currentEmail, account: currentAccount } =
      helpers.getUser(req)
    const { account, name, email, password, passwordCheck } = req.body

    const error = []
    let newEmail = ''
    let newAccount = ''

    if (currentEmail === email) {
      newEmail = currentEmail
    }
    if (currentAccount === account) {
      newAccount = currentAccount
    }
    if (password !== passwordCheck) {
      error.push({ message: '兩次密碼輸入不同！' })
    }

    if (currentEmail !== email) {
      await User.findOne({ where: { email } }).then((user) => {
        if (user) {
          error.push({ message: '信箱已經被註冊' })
        } else {
          newEmail = email
        }
      })
    }

    if (currentAccount !== account) {
      await User.findOne({ where: { account } }).then((user) => {
        if (user) {
          error.push({ message: '帳號已存在' })
        } else {
          newAccount = account
        }
      })
    }

    if (error.length !== 0) {
      return res.render('setting', { error })
    }

    if (!password) {
      return User.findByPk(id)
        .then((user) =>
          user.update({ name, email: newEmail, account: newAccount })
        )
        .then(() => {
          const success = []
          success.push({ message: '成功更新帳號資訊!' })
          return res.render('setting', { success })
        })
    } else {
      return User.findByPk(id)
        .then((user) =>
          user.update({
            name,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
            email: newEmail,
            account: newAccount
          })
        )
        .then(() => {
          req.flash('success_messages', '成功更新帳號資訊!')
          res.redirect('/tweets')
        })
    }
  }
}

module.exports = userController
