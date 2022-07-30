// admin頁面各種 signin/ getuser/ gettweet/ deletetweet/ logout
const { User, Tweet, Like, Reply } = require('../models')
const helpers = require('../_helpers')
const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
  },
  signIn: (req, res) => {
    if (helpers.getUser(req).role === 'user') {
      req.flash('error_messages', '帳號不存在！')
      req.logout()
      res.redirect('/admin/signin')
    }
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },
  getAdminUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        include: [
          { model: Tweet, include: [Like] },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
        ]
      })
      const results = users.map(user => ({
        ...user.toJSON(),
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
  },
  getAdminTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        include: [User],
        order: [['createdAt', 'DESC']],
      })
      const rederedTweets = tweets.map(r => ({
        ...r,
        description: r.description.substring(0, 50),
      }))
      return res.render('admin/tweets', { tweets: rederedTweets })
    } catch (err) {

      next(err)

    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) throw new Error("Tweet didn't exist!")
      await tweet.destroy()
      await Reply.destroy({ where: { TweetId } })
      await Like.destroy({ where: { TweetId } })

      req.flash('success_messages', '成功刪除貼文及相關資訊！')
      res.redirect('/admin/tweets')

    } catch (err) {

      next(err)

    }
  }
}

module.exports = adminController
