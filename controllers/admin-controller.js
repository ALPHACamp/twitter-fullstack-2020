const { Followship, Like, Reply, Tweet, User } = require('../models')
const adminController = {
  signInPage: (req, res, next) => {
    res.render('admin/admin-signin')
  },
  signIn: (req, res, next) => {
    req.flash('success_messages', '成功登入後台！')
    res.redirect('/admin/tweets')
  },
  logout: (req, res, next) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },
  getTweets: (req, res, next) => {
    res.render('admin/admin-tweets')
  },
  deleteTweet: (req, res, next) => {
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] },
        include: [
          { model: Tweet, include: [Like] },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      const results = users
        .filter(user => user.role !== 'admin')
        .map(user => ({
          ...user.toJSON()
        }))
      results.forEach(r => {
        r.TweetsCount = r.Tweets.length
        r.FollowingsCount = r.Followings.length
        r.FollowersCount = r.Followers.length
        r.TweetsLikedCount = r.Tweets.reduce((num, tweet) => {
          return num + tweet.Likes.length
        }, 0)
      })
      results.sort((a, b) => b.TweetsCount - a.TweetsCount)
      return res.render('admin/users', { users: results })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
