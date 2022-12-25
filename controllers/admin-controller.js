const { Like, Reply, Tweet, User } = require('../models')
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
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        include: [User],
        order: [['createdAt', 'DESC']]
      })
      const tweet = tweets.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      return res.render('admin/tweets', { tweets: tweet })
    } catch (err) {
      next(err)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) throw new Error("Tweet didn't exist!")
      await tweet.destroy()
      await Reply.destroy({ where: { TweetId } })
      await Like.destroy({ where: { TweetId } })
      req.flash('success_messages', '成功刪除貼文及相關資訊！')
      res.redirect('/admin/tweets')
    } catch (err) {
      next(err)
    }
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
