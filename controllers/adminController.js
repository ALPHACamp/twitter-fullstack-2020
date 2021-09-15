const db = require('../models')
const Tweet = db.Tweet
const User = db.User

const adminController = {
  signInPage: (req, res) => {
    return res.render('admin/signIn')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.send('signed in')
    // res.redirect('admin/tweets')
  }

}

module.exports = adminController