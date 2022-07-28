const { User, Tweet, Like } = require('../models')

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
      res.redirect(302, '/admin/tweets')
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
      const users = await User.findAll({
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          Like,
          Tweet
        ],
        where: { role: 'user' }
      })
      users.sort((a, b) => b.Tweets.length - a.Tweets.length)
      // res.render('admin/admin-users', { users })
      res.json({ users })
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: User,
        raw: true
      })
      // res.render('admin/admin-tweets',{tweets})
      res.json({ tweets })
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
      // res.json({ destroyTweet })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
