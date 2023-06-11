const { Tweet, User } = require('../models')

const adminController = {
  getSignin: (req, res) => {
    res.render('admin/login')
  },
  adminSignin: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },
  getTweets: (req, res, next) => {
    Tweet.findAll({
      raw: true,
      nest: true,
      include: [User]
    })
      .then(tweets => {
        res.render('admin/tweets', { tweets })
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
