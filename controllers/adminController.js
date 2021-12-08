const sequelize = require('sequelize')
const db = require('../models')
const Tweet = db.Tweet
const User = db.User

const adminController = {
  //admin登入
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },

  //admin管理推文
  getTweets: (req, res) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [['createdAt', 'DESC']],
    }).then((tweets) => {
      tweets = tweets.map((r) => ({
        ...r,
        description: r.description.length > 50 ? `${r.description.substring(0, 50)}...` : r.description,
      }))
      return res.render('admin/tweets', { tweets, page: 'tweets' })
    })
  },

  deleteTweet: (req, res) => {
    return Tweet.findByPk(req.params.id).then((tweet) => {
      tweet.destroy().then(() => {
        res.redirect('/admin/tweets')
      })
    })
  },

  //admin管理使用者
  getUsers: (req, res) => {
    return User.findAll({
      attributes: [
        'id',
        'account',
        'name',
        'cover',
        'avatar',
        'role',
        [
          //likeCount reference from https://github.com/Emily81926/twitter-api-2020 小鹿Kerwin, Vince, Ya Chu, Yang, Chaco
          sequelize.literal(
            `(select count(Tweets.UserId) from Tweets inner join Likes on Tweets.id = Likes.TweetId where Tweets.UserId = User.id)`
          ),
          'likeCount',
        ],
      ],
      include: [Tweet, { model: User, as: 'Followers' }, { model: User, as: 'Followings' }],
    }).then((users) => {
      users = users.filter((user) => user.role === 'user')
      users = users.map((r) => {
        return {
          ...r.dataValues,
          tweetCount: r.Tweets.length,
          followerCount: r.Followers.length,
          followingCount: r.Followings.length,
        }
      })
      return res.render('admin/users', { users, page: 'users' })
    })
  },
}
module.exports = adminController
