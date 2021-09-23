const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const { Op } = require("sequelize")
const sequelize = require('sequelize')

const adminController = {
  signinPage: (req, res) => {
    return res.render('admin/adminSignIn')
  },
  signin: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },

  getTweets: (req, res) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [['createdAt', 'DESC']],
    })
      .then(tweet => {
        tweet = tweet.map(r => ({
          ...r.dataValues,
          User: r.User,
          id: r.id,
          updatedAt: r.updatedAt,
          description: r.description.length > 50 ? r.description.substring(0, 50) + '...' : r.description,
        }))
        return res.render('admin/adminTweets', { tweet: tweet })
      })
  },

  deleteTweets: (req, res) => {
    return Tweet.findByPk(req.params.id)
      .then((tweet) => {
        tweet.destroy()
      })
      .then((tweet) => {
        res.redirect('/admin/tweets')
      })
  },

  getUsers: (req, res) => {
    return Promise.all([
      User.findAll({
        where: { role: { [Op.ne]: 'admin' } },
        include: [
          Reply, Like,
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
      }),
      Tweet.findAll({
        attributes: ['userId', [sequelize.fn('COUNT', sequelize.col('userId')), 'tweetCount']],
        group: ['userId'],
        raw: true, nest: true,
      })
    ])
      .then(([users, tweets]) => {
        const usersList = users.map(user => ({
          cover: user.cover,
          avatar: user.avatar,
          name: user.name,
          account: user.account,
          tweetCount: tweets.filter(d => d.userId === user.id)[0] ? tweets.filter(d => d.userId === user.id)[0].tweetCount : 0,
          replyCount: user.Replies.length,
          likeCount: user.Likes.length,
          followerCount: user.Followers.length,
          followingCount: user.Followings.length
        }))
        const usersSorted = usersList.sort((a, b) => b.tweetCount - a.tweetCount)
        res.render('admin/adminUsers', { users: usersSorted })
      })
  }
}

module.exports = adminController