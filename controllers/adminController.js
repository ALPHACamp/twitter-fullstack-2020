const bcrypt = require('bcryptjs')
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
  },
  signin: (req, res) => {
    // 檢查必要資料
    if (!req.body.account || !req.body.password) {
      return res.redirect('/admin/signin')
    }
    // 檢查 user 是否存在與密碼是否正確
    let username = req.body.account
    let password = req.body.password

    User.findOne({ where: { account: username } }).then(user => {
      if (!user) return res.status(401).redirect('/admin/signin')
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).redirect('/admin/signin')
      }
      if (user.role !== 'admin') return res.status(401).redirect('/admin/signin')
      // 簽發 token
      let payload = { id: user.id }
      let token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.redirect('/admin/tweets')
    }).catch(err => console.log(err))
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
module.exports = adminController
