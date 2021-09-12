const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User

const userController = {
  signupPage: (req, res) => {
    return res.render('signup', { layout: 'other' })
  },

  signup: (req, res) => {
    const { account, name, email, password } = req.body

    User.create({
      account,
      name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    }).then(user => {
      console.log('done')
      return res.redirect('/signin')
    })
  }
}

module.exports = userController