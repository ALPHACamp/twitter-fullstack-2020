const { Followship, Like, Reply, Tweet, User } = require('../models')
const adminController = {
  signInPage: (req, res, next) => {
  },
  signIn: (req, res, next) => {
  },
  logout: (req, res, next) => {
  },
  getTweets: (req, res, next) => {
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
