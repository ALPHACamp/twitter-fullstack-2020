const jwt = require('jsonwebtoken')

const _helper = require('../../_helpers')
const userController = {
  adminSignin: (req, res, next) => {
    try {
      return res.redirect('/admin')
    } catch (error) {
      return next(error)
    }
  },
  userSignin: (req, res, next) => {
    try {
      return res.redirect('/')
    } catch (error) {
      return next(error)
    }
  },
  getAdminSignInPage: (req, res, next) => {
    try {
      console.log('is authenticated: ', req.isAuthenticated())
      if (_helper.ensureAuthenticated(req)) return res.redirect('/admin')
      return res.render('admin/signin')
    } catch (error) {
      return next(error)
    }
  },
  getAdminHomePage: (req, res, next) => {
    try {
      return res.render('admin/homepage')
    } catch (error) {
      return next(error)
    }
  },
  // 以下兩個logout重複需要合併優化
  adminLogout: (req, res, next) => {
    try {
      if (req && req.cookies) {
        res.cookie('jwtToken', '', { expires: new Date(0) })
        return res.redirect('/admin/signin')
      }
      next()
    } catch (error) {
      return next(error)
    }
  },

  userLogout: (req, res, next) => {
    try {
      if (req && req.cookies) {
        res.cookie('jwtToken', '', { expires: new Date(0) })
        return res.redirect('/signin')
      }
      next()
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = userController
