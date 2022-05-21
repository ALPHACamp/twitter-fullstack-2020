const { Tweet, User, Like } = require('../models')

const helpers = require('../_helpers')

const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
  },
  signIn: (req, res) => {
    if (helpers.getUser(req).role === 'user') {
      req.flash('error_messages', '帳號不存在')
      req.logout()
      res.redirect('/signin')
    }
    req.flash('success_messages', 'Admin成功登入！')
    res.redirect('/admin/tweets')
  },
  getTweets: (req, res, next) => {
    Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        const tweetPreview = tweets.map(t => ({
          ...t,
          description: t.description.substring(0, 50)
        }))
        return res.render('admin/tweets', {
          tweets: tweetPreview
        })
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        return tweet.destroy()
      })
      .then(() => res.redirect('/admin/tweets'))
      .catch(err => next(err))
  },
  getUsers: (req, res, next) => {
    return User.findAll({
      nest: true,
      include: [
        { model: Tweet, include: Like },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(users => {
        let data = users
          .map(user => ({
            ...user.toJSON(),
            tweetCount: user.Tweets.length,
            likeCount: function () {
              let userLikes = 0
              user.Tweets.forEach(tweet => {
                userLikes += tweet.Likes.length
              })
              return userLikes
            },
            followers: user.Followers.length,
            followings: user.Followings.length
          }))
          data = data.sort((a, b) => b.tweetCount - a.tweetCount)
        res.render('admin/users', { users: data })
      })
      .catch(err => next(err))
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/admin/signin')
  }
}

module.exports = adminController
