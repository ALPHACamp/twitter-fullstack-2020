const helpers = require('../_helpers.js')
const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const Followship = db.Followship

const adminController = {
  getTweets: (req, res) => {
    return Tweet.findAll({
      include: User,
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        tweets = tweets.map(tweet => ({
          ...tweet.dataValues,
          description: tweet.dataValues.description.substring(0, 50)
        }))
        return res.render('admin/tweets', { tweets })
      })
  },

  deleteTweet: (req, res) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        tweet.destroy()
          .then(tweet => {
            return res.redirect('back')
          })
      })
  },

  getUsers: (req, res) => {
    return User.findAll({
      include: [Tweet,
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
        { model: Tweet, as: 'LikedTweets' },
      ]
    })
      .then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          TweetsCount: user.Tweets.length
        }))
        users = users.sort((a, b) => b.TweetsCount - a.TweetsCount)
        return res.render('admin/users', { users })
      })
  },

  signinPage: (req, res) => {
    return res.render('admin/signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', "成功登入！")
    res.redirect('/admin/tweets')
  },


}

module.exports = adminController