const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  const isUser = helpers.getUser(req)?.role === 'user'
  if (helpers.ensureAuthenticated(req)) {
    if (isUser) {
      return next()
    }
    req.flash('error_messages', '請至後台登入!')
    return res.redirect('/signin')
  } else {
    req.flash('error_messages', '請先登入!')
    return res.redirect('/signin')
  }
}

const authenticatedAdmin = (req, res, next) => {
  const isAdmin = helpers.getUser(req)?.role === 'admin'
  console.log(0)
  if (helpers.ensureAuthenticated(req)) {
    console.log(1)
    if (isAdmin) {
      console.log(2)
      return next()
    }
    req.flash('error_messages', '請至前台登入!')
    console.log(3)
    return res.redirect('/admin/signin')
  } else {
    req.flash('error_messages', '請先登入!')
    console.log(4)
    return res.redirect('/admin/signin')
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
