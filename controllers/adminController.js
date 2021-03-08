const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const helpers = require('../_helpers')
const sequelize = require('sequelize')
function isLiked(req, tweet) {
  return helpers.getUser(req).Likes ? helpers.getUser(req).Likes.map(d => d.TweetId).includes(tweet.id) : false
}


const adminController = {
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: (req, res) => {
    return res.render('admin/main')
  },
  getTweets: (req, res) => {
    return Tweet.findAll({
      include: [User]
    }).then(tweets => {
      tweets = tweets.map(item => ({
        ...item.dataValues,
        description: item.description.substring(0, 50),
        name: item.User.name,
        account: item.User.account
      }))
      // console.log(tweets)
      res.render('admin/tweets', { tweets })
    })
  },
  deleteTweet: (req, res) => {
    return Tweet.findById(req.params.id)
      .then((tweets) => {
        tweets.destroy()
          .then((tweets) => {
            res.redirect('/admin/tweets')
          })
      })
  },
  getUsers: (req, res) => {
    return User.findAll({
      include: [
        Tweet,
        Like,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        FollowingCount: user.Followings.length,
        likesCount: user.Likes.length,
        tweetsCount: user.Tweets.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(users.id)
      }))

      users = users.sort((a, b) => b.tweetsCount - a.tweetsCount)
      return res.render('admin/users', { users: users })

    })
  },
}

module.exports = adminController