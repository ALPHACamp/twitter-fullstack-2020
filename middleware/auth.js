const helpers = require('../_helpers')

exports.authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}

exports.authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return next()
    }
    return res.redirect('back')
  }
  res.redirect('/signin')
}

exports.userauthenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req) && helpers.getUser(req).role !== 'admin') {
    return next()
  }
  if (helpers.ensureAuthenticated(req) && helpers.getUser(req).role === 'admin') {
    // req.flash('error_messages', '管理員請從後台登入')
    // return res.redirect('/signin')
    return res.redirect('/admin/tweets')
  }
  res.redirect('/signin')
}

exports.getSign = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).id === Number(req.params.id)) return next()
    return res.redirect('back')
  }
  res.redirect('/signin')
}
