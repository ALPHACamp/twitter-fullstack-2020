const { User, Tweet } = require('../models')

const adminController = {
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: async (req, res) => {
    req.flash('success_messages', '成功登入！')
    return res.redirect('/admin/tweets')
  },
  getTweets: (req, res, next) => {
    Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        res.render('admin/tweets', { tweets })
      })
      .catch(err => next(err))
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        raw: true,
        nest: true
      })
      return res.render('admin/users', { users })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
