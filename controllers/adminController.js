const helpers = require('../_helpers')
const db = require('../models')
const Tweet = db.Tweet
const User = db.User

const adminController = {
  loginPage: (req, res) => {
    return res.render('admin/login')
  },
  getTweets: (req, res) => {
    return Tweet.findAll({
      include: [User]
    }).then(tweets => {
      tweets = tweets.map(item => ({
        ...item.dataValues,
        description: item.dataValues.description.substring(0, 50)
      }))
      res.render('admin/tweets', { tweets })
    })
  },
  getUsers: (req, res) => {
    return User.findAll({
      include: [
        Tweet,
        { model: Tweet, as: 'LikedTweets' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    }).then(results => {
      const data = results.map(item => ({
        ...item.dataValues,
        LikesCount: item.dataValues.LikedTweets.length,
        followersCount: item.dataValues.Followers.length,
        followingsCount: item.dataValues.Followings.length
      }))
      const users = data.sort((a, b) => b.tweetsCount - a.tweetsCount)
      res.json({ users })
    })
  },
  login: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('/admin/login')
  }
}

module.exports = adminController