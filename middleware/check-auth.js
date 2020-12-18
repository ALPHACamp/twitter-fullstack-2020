const helpers = require('../_helpers')

module.exports = {
  authenticatedUser: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === "") { return next() }
      req.flash('error_messages', 'admin帳號無法登入...')
    } 
    return res.redirect('/signin')
  },

  authenticatedAdmin: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') { return next() }
      req.flash('error_messages', 'user帳號無法登入...')
    } 
    return res.redirect('/admin/signin')
  },

  isOwnProfile: (req, res, next) => {
    const userId = res.locals.user.id.toString() //user id of the authenticated user
    const profileUserId = req.params.id // user id of the user profile
    res.locals.isOwnProfile = userId === profileUserId ? true : false
    next()
  },
  editOwnProfile: (req, res, next) => {
    const userId = res.locals.user.id.toString() //user id of the authenticated user
    const profileUserId = req.params.id // user id of the user profile
    if (userId === profileUserId) {
      return next()
    } else {
      req.flash('error_messages', '無權訪問該頁面')
      res.redirect(`/users/${profileUserId}`)
    }
  }
}