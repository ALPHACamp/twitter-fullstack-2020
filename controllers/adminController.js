const bcrypt = require('bcrypt-nodejs')
const { name } = require('faker')
const { authenticate } = require('passport')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship

const pageLimit = 10

const adminController = {
  getLogin: (req, res) => {
    return res.render('adminLogin', { layout: "userMain" })
  },

  postLogin: (req, res) => {
    res.redirect('/admin/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功')
    req.logout()
    res.redirect('/admin/signin')
  },

  getTweets: (req, res) => {
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    Tweet.findAndCountAll({
      include: [User],
      offset,
      limit: pageLimit
    }).then(result => {
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      const data = result.rows.map(t => ({
        ...t.dataValues,
        description: t.dataValues.description ?
          t.dataValues.description.substring(0, 50) : false,
        avatar: t.User.avatar,
        account: t.User.account,
        name: t.User.name
      }))
      return res.render('adminTweets', {
        layout: 'adminMain',
        tweets: data,
        page,
        totalPage,
        prev,
        next
      })
    })
  },

  deleteTweet: (req, res) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        tweet.destroy()
          .then(() => {
            res.redirect('/admin/tweets')
          })
      })
  },

  getUsers: (req, res) => {
    return User.findAll({
      where: { role: 'user' },
      attributes: ['name', 'account', 'avatar', 'cover'],
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Tweet, as: 'LikedTweets' },
        Tweet
      ]
    }).then(data => {
      const users = data.map(d => ({
        ...d.dataValues,
        followerCount: d.Followers.length,
        followingCount: d.Followings.length,
        tweetCount: d.Tweets.length,
        likedCount: d.LikedTweets.length
      }))
      users.sort((a, b) => b.tweetCount - a.tweetCount)
      
      return res.render('adminUsers', { layout: 'adminMain', users })
    })
  }
}

module.exports = adminController