const helpers = require('../helpers/auth-helpers')

const adminController = {
  getTweets: (req, res) => {
    return res.render('admin/tweets')
  },
  signInPage: (req, res) => {
    return res.render('admin/signin', { url: req.url })
  },
  signIn: (req, res) => {
    if (!helpers.getUser(req).isAdmin) {
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
