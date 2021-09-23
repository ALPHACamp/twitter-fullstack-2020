const bcrypt = require('bcrypt-nodejs')
const db = require('../../models')
const User = db.User

let userController = {
  userSetting: (req, res) => {
    res.render('/setting')
  },

  getUserSetting: (req, res) => {},

  putUserSetting: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/setting')
    } else {
      User.findOne({ where: { account: req.body.account } }).then((user) => {
        if (user && req.body.account !== user.account) {
          req.flash('error_messages', '此帳號已有人使用！')
          return res.redirect('/setting')
        }
      })
      return User.findByPk(req.params.id).then((user) => {
        user.update({
          account: req.body.account,
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        })
      })
    }
  },
}

module.exports = userController
