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
    res.render('admin/users')
  },
  adminSignin: (req, res, next) => {
    req.flash('success_messages', '成功登入!')
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
      res.render('admin/tweets', {
        user,
        tweets: tweets
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
      res.render('admin/users', { users })
      console.log('adminGetUsers')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
