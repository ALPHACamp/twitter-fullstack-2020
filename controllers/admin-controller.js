const { User, Tweet, Like } = require('../models')
const helper = require('../_helpers')

const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
  },
  signIn: (req, res) => {
    if (helper.getUser(req).role === 'user') {
      req.flash('error_messages', '帳號不存在！')
      res.redirect('/admin/signin')
    } else {
      req.flash('success_messages', '成功登入')
      res.redirect('/admin/tweets')
    }
  },
  logOut: (req, res) => {
    req.flash('success_messages', '成功登出')
    res.redirect('/signin')
  },
  getTweets: (req, res, next) => {
    const tweetRoute = true
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [
        ['created_at', 'DESC']
      ]
    })
      .then(tweets => {
        if (!tweets) throw new Error('Tweets do not exist!')
        tweets = tweets.map(tweet => ({
          ...tweet,
          description: tweet.description.substring(0, 50)
        }))
        res.render('admin/tweets', { tweets, tweetRoute })
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) throw new Error('The tweet did not exist!')
        tweet.destroy()
      })
      .then(() => {
        res.redirect('/admin/tweets')
      })
      .catch(err => next(err))
  },
  getUsers: (req, res, next) => {
    const userRoute = true
    return User.findAll({
      attributes: [
        'id', 'account', 'name', 'email', 'avatar', 'cover', 'role'
      ],
      include: [
        { model: Tweet },
        { model: Like, as: 'LikedTweets' },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    })
      .then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          tweetsCount: user.Tweets.length,
          likesCount: user.LikedTweets.length,
          followingsCount: user.Followings.length,
          followersCount: user.Followers.length
        }))
        users = users.sort((a, b) => b.tweetsCount - a.tweetsCount)
        res.render('admin/users', { users, userRoute })
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
