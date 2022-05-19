const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') {
      res.redirect('/admin/tweets')
    } else {
      return next()
    }
  }
  req.flash('error_messages', '請先登入!')
  res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return next() 
    }
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}

