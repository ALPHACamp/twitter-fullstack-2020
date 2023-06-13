const helpers = require('../_helpers')
const { User, Tweet } = require('../models')

const adminController = {
  adminSigninPage: (req, res) => {
    res.render('admin/signin')
  },
  adminTweetsPage: (req, res) => {
    res.render('admin/tweets')
  },
  adminUsersPage: (req, res) => {
    res.render('admin/tweets')
  },
  adminSignin: (req, res, next) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },
  adminGetTweets: async (req, res, next) => {
    const userId = helpers.getUser(req).id
    try {
      let [user, tweets] = await Promise.all([
        User.findByPk(userId, {
          raw: true,
          nest: true
        }),
        Tweet.findAll({
          include: User,
          order: [['createdAt', 'DESC']]
        })
      ])
      tweets = tweets.map(tweet => ({
        ...tweet.toJSON()
      }))
      const partialName = 'admin-tweets'
      res.render('admin/tweets', {
        user,
        tweets: tweets,
        partialName
      })
      console.log('adminGetTweets')
    } catch (err) {
      next(err)
    }
  },
  adminGetUsers: async (req, res, next) => {
    try {
      const [users] = await Promise.all([
        User.findAll({
          raw: true,
          nest: true,
          where: {
            role: 'user'
          },
          order: [['createdAt', 'DESC']]
        })
      ])
      const partialName = 'admin-users'
      const userPage = true
      res.render('admin/tweets', { users, partialName, userPage })
      console.log('adminGetUsers')
    } catch (err) {
      next(err)
    }
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('admin/signin')
  }
}

module.exports = adminController
