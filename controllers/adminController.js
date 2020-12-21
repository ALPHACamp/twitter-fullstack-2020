const bcrypt = require('bcryptjs')
const passport = require('../config/passport')
const db = require('../models')
const user = require('../models/user')
const { User, Tweet, Reply, Like } = db

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const adminController = {
  signinPage: (req, res) => {
    return res.render('admin/signin')
<<<<<<< HEAD
  },
  signin: (req, res) => {
    req.flash('success_messages', '登入成功')
    res.redirect('/admin/tweets')
  },
  getTweets: (req, res) => {
    Tweet.findAll({
      raw: true, nest: true,
      include: [User], order: [['createdAt', 'DESC']]
    }).then(tweets => {
      tweets = tweets.map(tweet => ({
        ...tweet,
        description: tweet.description.substring(0, 50),
      }))
      return res.render('admin/tweets', { tweets: tweets })
    }
    )
  },
  deleteTweet: (req, res) => {
    Tweet.findByPk(req.params.id).then(tweet => {
      tweet.destroy()
      return res.redirect('back')
    })
  },
  getUsers: (req, res) => {
    User.findAll({
      where: { role: "" }, include: [Tweet, Like, { model: User, as: 'Followers' }, { model: User, as: 'Followings' }]
    })
      .then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          tweetCount: user.Tweets.length,
          followingCount: user.Followings.length,
          followerCount: user.Followers.length,
          tweetLiked: user.Likes.filter(like => like.likeOrNot === true).length,
          tweetDisliked: user.Likes.filter(unlike => unlike.likeOrNot === false).length
        }))
        users = users.sort((a, b) => b.tweetCount - a.tweetCount)
        return res.render('admin/users', { users })
      }).catch(err => console.log(err))
  },
}
=======
  }
}

>>>>>>> layout
module.exports = adminController
