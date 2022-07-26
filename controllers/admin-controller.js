const jwt = require('jsonwebtoken')

const adminController = {
  signInPage: async (req, res, next) => {
    try {
      res.render('admin/signin')
    } catch (err) {
      next(err)
    }
  },
  signIn: async (req, res, next) => {
    try {
      req.flash('success_messages', '成功登入！')
      // res.redirect('/admin/tweets')
      const userData = req.user.toJSON()
      delete userData.password
      res.json({
        status: 'success',
        data: {
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  logout: async (req, res, next) => {
    try {
      req.flash('success_messages', '成功登出！')
      req.logout()
      res.redirect('/admin/signin')
    } catch (err) {
      next(err)
    }
  },
  getUsers: (req, res, next) => {
    res.json({ status: 'success' })
  },
  getTweets: (req, res, next) => {
    res.json({ status: 'success' })
  },
  deleteTweet: (req, res, next) => {
    res.json({ status: 'success' })
  }
}

module.exports = adminController
