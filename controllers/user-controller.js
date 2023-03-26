const bcrypt = require('bcryptjs') //載入 bcrypt
const db = require('../models')
const { User } = db
const userController = {
    registPage: (req, res) => {
    res.render('regist')
  },
  regist: (req, res) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        res.redirect('/login')
      })
  }
}
module.exports = userController