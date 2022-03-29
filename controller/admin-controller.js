const { Tweet, User } = require('../models')
const helpers = require('../_helpers')

const adminController = {
  getTweets: (req, res, next) => {
    Tweet.findAll({
      raw: true,
      nest: true,
      include: [User]
    })
      .then(tweets => res.render('admin/tweets', { tweets }))
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    return res.render('admin/signin', { url: req.url })
  },
  signIn: (req, res) => {
    if (helpers.getUser(req).role === null) {
      req.flash('error_messages', '請從前台登入')
      req.logout()
      return res.redirect('/signin')
    }
    req.flash('success_messages', 'Admin login successfully')
    return res.redirect('/admin/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Logout successfully')
    req.logout()
    return res.redirect('/admin/signin')
  }
}
module.exports = adminController
