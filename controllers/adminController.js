const bcrypt = require('bcryptjs')
const passport = require('../config/passport')
const db = require('../models')
const user = require('../models/user')
const { User, Tweet, Reply, Like } = db
const pageLimit = 10

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const adminController = {
  signinPage: (req, res) => {
    return res.render('admin/signin')
  },
  signin: (req, res) => {
    req.flash('success_messages', '登入成功')
    res.redirect('/admin/tweets')
  },
  getTweets: (req, res) => {
    let offset = 0

    if (req.query.page) {
      offset = (Number(req.query.page) - 1) * pageLimit
    }
    Tweet.findAndCountAll({
      include: [User], raw: true, nest: true, order: [['createdAt', 'DESC']], offset: offset, limit: pageLimit
    }).then(result => {
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPages = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 <= 0 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1
      const tweets = result.rows.map(t => ({
        ...t,
        description: t.description.substring(0, 50),
        User: t.User
      }))
      return res.render('admin/tweets', { tweets, totalPages, prev, next, page })
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
      where: { role: '' }, include: [Tweet, Like, { model: User, as: 'Followers' }, { model: User, as: 'Followings' }]
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
  }
}
module.exports = adminController
