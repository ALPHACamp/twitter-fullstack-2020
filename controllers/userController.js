const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')

const userController = {
  signUpPage: (req, res) => res.render('signup'),
  signUp: (req, res) => {
    const { account, name, email, password, passwordCheck } = req.body
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    const errorMessage = []

    if (password !== passwordCheck) {
      errorMessage.push({ message: '密碼與確認密碼必須相同' })
      return res.render('signup', { account, name, email, errorMessage })
    }

    User.findOne({ where: { $or: [{ email }, { account }] } })
      .then(user => {
        if (user) {
          if (user.email === email) { errorMessage.push({ message: 'Email已被註冊' }) }
          if (user.account === account) { errorMessage.push({ message: '帳號名稱已被使用' }) }
          return res.render('signup', { account, email, name, errorMessage })
        }
        return User.create({ account, name, email, hashPassword })
          .then(() => {
            req.flash('successMessage')
            res.redirect('signin')
          })
      })
  }
}


module.exports = userController