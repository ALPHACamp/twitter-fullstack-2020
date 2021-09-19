const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const { Op } = require("sequelize")

const adminController = {
  //登入登出
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

  //貼文相關
  //顯示所有貼文
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
          description: r.description.substring(0, 50),
        }))
        return res.render('admin/adminTweets', { tweet: tweet })
      })
  },
  //刪除貼文
  deleteTweets: (req, res) => {
    return Tweet.findByPk(req.params.id)
      .then((tweet) => {
        tweet.destroy()
      })
      .then((tweet) => {
        res.redirect('/admin/tweets')
      })
  },

  //使用者清單
  getUsers: (req, res) => {
    return User.findAll({
      where: { role: { [Op.ne]: 'admin' } },
      include: [
        Tweet, Reply, Like,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ],
    }).then(user => {
      const users = user.map(user => ({
        cover: user.cover,
        avatar: user.avatar,
        name: user.name,
        account: user.account,
        tweetCount: user.Tweets.length,
        replyCount: user.Replies.length,
        likeCount: user.Likes.length,
        followerCount: user.Followers.length,
        followingCount: user.Followings.length
      }))
      const usersSorted = users.sort((a, b) => b.tweetCount - a.tweetCount)
      res.render('admin/adminUsers', { users: usersSorted })
    })

  }
}

module.exports = adminController