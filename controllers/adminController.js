const helpers = require('../_helpers.js')
const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const Followship = db.Followship

const adminController = {
  getTweets: (req, res) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: User
    })
      .then(tweets => {
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
      .then(user => {
        return res.render('admin/users', { user })
      })
  }
}

module.exports = adminController