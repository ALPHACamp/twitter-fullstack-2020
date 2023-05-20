const { User, Tweet, Like } = require('../models')
const helpers = require('../_helpers')

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
      res.statusCode = 302
      res.location('/admin/tweets')
      res.end('')
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
  getUsers: async (req, res, next) => {
    try {
      const admin = helpers.getUser(req)
      const users = await User.findAndCountAll({
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          { model: Tweet, include: Like }
        ],
        where: { role: 'user' }
      })
      users.rows = users.rows.map(u => u.toJSON())
      users.rows = users.rows.map(u => ({
        ...u,
        likeCount: helpers.getThousands(
          u.Tweets.reduce((a, b) => {
            return a + b.Likes.length
          }, 0)
        ),
        tweetCount: helpers.getThousands(u.Tweets.length)
      }))
      users.rows.sort((a, b) => b.Tweets.length - a.Tweets.length)
      res.render('admin/admin-users', { users: users.rows, role: admin.role })
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: User,
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      tweets.forEach(t => {
        if (t.description.length > 50) {
          t.description = t.description.substring(0, 50) + '...'
        }
      })
      const admin = helpers.getUser(req)
      res.render('admin/admin-tweets', { tweets, role: admin.role })
    } catch (err) {
      next(err)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) throw new Error("Tweet didn't exist")
      await tweet.destroy()
      res.redirect('/admin/tweets')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
