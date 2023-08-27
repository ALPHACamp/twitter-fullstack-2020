const { Tweet, User, Like } = require('../models')

const adminController = {
  signInPage: (req, res) => {
    res.render('admins/signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '管理員成功登入！')
    res.redirect('/admin/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '管理員登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },
  getAdminTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: User,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']]
      })
      if (!tweets) throw new Error('沒有推文可顯示!')
      tweets.forEach(tweet => {
        tweet.description = tweet.description.substring(0, 50)
      })
      return res.render('admins/tweets', { tweets, route: 'tweets' })
    } catch (err) {
      next(err)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      await Tweet.destroy({
        where: { id: req.params.tweetId }
      })
      req.flash('success_messages', '成功刪除該則推文!')
      return res.redirect('/admin/tweets')
    } catch (err) {
      next(err)
    }
  },
  getAdminUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        include: [
          Like,
          Tweet,
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        nest: true
      })
      if (!users) throw new Error('沒有使用者可顯示!')
      const userInfos = users.filter(user => user.toJSON().role === 'user')
        .map(user => {
          const userInfo = user.toJSON()
          userInfo.tweetCount = userInfo.Tweets.length
          userInfo.likeCount = userInfo.Likes.length
          userInfo.followerCount = userInfo.Followers.length
          userInfo.followingCount = userInfo.Followings.length
          return userInfo
        })
        .sort((a, b) => b.tweetCount - a.tweetCount)
      res.render('admins/users', {
        userInfos,
        route: 'users'
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
