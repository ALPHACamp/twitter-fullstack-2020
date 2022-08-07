const { User, Tweet } = require('../models')
const sequelize = require('sequelize')
const { getOffsetAdminTweets, getPaginationAdminTweets, getOffsetAdminUsers, getPaginationAAdminUsers } = require('../helpers/pagination-helpers')

const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入!')
    res.redirect('/admin/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出!')
    req.logout()
    res.redirect('/admin/signin')
  },
  getTweets: (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffsetAdminTweets(limit, page)
    return Tweet.findAll({
      order: [['createdAt', 'DESC']],
      attributes: [
        'id', 'createdAt',
        [sequelize.literal('substring(description,1,50)'), 'description']
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
        if (!tweet) throw new Error('推文不存在!')
        return tweet.destroy()
      })
      .then(deletedTweet => res.redirect('/admin/tweets'))
      .catch(next)
  },
  getUsers: (req, res, next) => {
    const DEFAULT_LIMIT = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffsetAdminUsers(limit, page)
    return User.findAll({
      where: { role: 'user' },
      attributes: ['name', 'account', 'avatar', 'banner',
        [sequelize.literal('(SELECT COUNT(*) from Tweets WHERE Tweets.user_id = User.id)'), 'tweetsCount'],
        [sequelize.literal('(SELECT COUNT(*) from Likes WHERE Likes.user_id = User.id)'), 'likesCount'],
        [sequelize.literal('(SELECT COUNT(*) from Followships WHERE Followships.following_id = User.id)'), 'followingsCount'],
        [sequelize.literal('(SELECT COUNT(*) from Followships WHERE Followships.follower_id = User.id)'), 'followersCount']
      ],
      order: [
        [sequelize.literal('tweetsCount'), 'DESC']
      ],
      limit,
      offset,
      raw: true,
      nest: true
    })
      .then(users => {
        return res.render('admin/users', {
          users,
          pagination: getPaginationAAdminUsers(limit, page, users.count)
        })
      })
      .catch(next)
  }
}

module.exports = adminController
