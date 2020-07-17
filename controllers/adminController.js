const db = require('../models')
const Tweet = db.Tweet
const User = db.User

const adminController = {
  adminSigninPage: (req, res) => {
    res.render('adminSigninPage')
  },
  adminSignIn: (req, res) => {
    const { email, password } = req.body
  },
  adminSignOut: (req, res) => {
    // 登出
  },
  adminTweetsPage: (req, res) => {
    Tweet.findAll({ raw: true, nest: true })
      .then(tweets => res.json({ tweets }))
      .catch(err => console.log(err))
  },
  adminUsersPage: (req, res) => {
    User.findAll({ raw: true, nest: true })
      .then(users => res.json({ users }))
      .catch(err => console.log(err))
  }
}

module.exports = adminController
