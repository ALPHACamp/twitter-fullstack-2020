const { User, Tweet } = require('../models')

const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入')
    res.redirect('/admin/tweets')
  },
  logOut: (req, res) => {
    req.flash('success_messages', '成功登出')
    res.redirect('/admin/signin')
  },
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [
        ['created_at', 'DESC']
      ]
    })
      .then(tweets => {
        if (!tweets) throw new Error('Tweets do not exist!')
        res.render('admin/tweets', { tweets })
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
