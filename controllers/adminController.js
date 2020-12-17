const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like


module.exports = {
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },

  getTweets: (req, res) => {
    Tweet.findAll({ include: [User] }).then(tweets => {
      tweets = tweets.map((t, _) => ({
        ...t.dataValues,
        description: t.description.substring(0, 50)
      }))

      res.render('admin/tweets', {
        tweets
      })
    })
  },

  deleteTweet: (req, res) => {
    Tweet.findOne({ where: { id: req.params.id } })
      .then(tweet => {
        return tweet.destroy()
          .then(tweet => res.redirect('/admin/tweets'))
      })
  },

  getUsers: (req, res) => {
    User.findAll({
      include: [Tweet, Like]
    })
      .then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          NumberOfTweets: user.Tweets.length,
          NumberOfLikes: user.Likes.length,
          NumberOfFollowers: req.user.Followers.length,
          NumberOfFollowings: req.user.Followings.length
        }))

        res.render('admin/users', {
          users
        })
      })
  }
}