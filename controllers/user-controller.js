const bcrypt = require('bcryptjs') //載入 bcrypt
const db = require('../models')
const { User } = db
const userController = {
    registPage: (req, res) => {
    res.render('regist')
  },
  regist: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

     User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!') 
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({  
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/login')
      })
      .catch(err => next(err)) 
  }
}
module.exports = userController