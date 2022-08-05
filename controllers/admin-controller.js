const { User, Tweet } = require('../models')
const sequelize = require('sequelize')
const { getOffsetAdminTweets, getPaginationAdminTweets, getOffsetAdminUsers, getPaginationAAdminUsers } = require('../helpers/pagination-helpers')

const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'login successfully!')
    res.redirect('/admin/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'logout successfully!')
    req.logout()
    res.redirect('/admin/signin')
  },
  getTweets: (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffsetAdminTweets(limit, page)
    return Tweet.findAll({
      order: [['created_at', 'DESC']],
      attributes: [
        'id', 'created_at',
        [sequelize.literal('substring(description,1,100)'), 'description']
      ],
      include: [{
        model: User,
        attributes: ['id', 'name', 'account', 'avatar']
      }],
      limit,
      offset,
      raw: true,
      nest: true
    })
      .then(tweets => {
        return res.render('admin/tweets', {
          tweets,
          pagination: getPaginationAdminTweets(limit, page, tweets.count)
        })
      })
      .catch(next)
  },
  deleteTweet: (req, res, next) => {
    const { id } = req.params
    return Tweet.findByPk(id)
      .then(tweet => {
        if (!tweet) throw new Error("Restaurant didn't exist!")
        return tweet.destroy()
      })
      .then(() => res.redirect('/admin/tweets'))
      .catch(next)
  },
  getUsers: (req, res, next) => {
    const DEFAULT_LIMIT = 6
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffsetAdminUsers(limit, page)
    return User.findAll({
      // where: { role: 'user' }, 加上這一行跑測試檔不會過，真詭異！想不透！
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT(*) from tweets AS tweet WHERE tweet.user_id = user.id)'), 'tweetsCount'],
          [sequelize.literal('(SELECT COUNT(*) from likes WHERE likes.user_id = user.id)'), 'likesCount'],
          [sequelize.literal('(SELECT COUNT(*) from followships WHERE followships.following_id = user.id)'), 'followingsCount'],
          [sequelize.literal('(SELECT COUNT(*) from followships WHERE followships.follower_id = user.id)'), 'followersCount']
        ]
      },
      order: [
        [sequelize.literal('tweetsCount'), 'DESC']
      ],
      limit,
      offset,
      raw: true,
      nest: true
    })
      .then(users => {
        const normalUsers = users.filter(user => user.role !== 'admin')
        return res.render('admin/users', {
          users: normalUsers,
          pagination: getPaginationAAdminUsers(limit, page, users.count)
        })
      })
      .catch(next)
  }
}

module.exports = adminController
