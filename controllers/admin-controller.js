// admin頁面各種 signin/ getuser/ gettweet/ deletetweet/ logout
const { User, Tweet, Like } = require('../models')
const { sequelize } = require('../models')
const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },
  getAdminUsers: (req, res, next) => {
    return User.findAll({
      where: { role: 'user' },
      include: [
        { model: Tweet, include: [Like] },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ]
    })
      .then(users => {
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
        res.render('admin/users', { users: results })
      })
      .catch(err => next(err))
  },
  getAdminTweets: (req, res, next) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [['createdAt', 'DESC']],
    })
      .then(tweets => {
        tweets = tweets.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
        }))
        return res.render('admin/tweets', { tweets })
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        tweet.destroy()
      })
      .then(() => {
        res.redirect('/admin/tweets')
      })
      .catch(err => next(err))
  },
}

module.exports = adminController
