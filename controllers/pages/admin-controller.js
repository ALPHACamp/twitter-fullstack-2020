const { User, Tweet, Like, sequelize } = require('../../models')
const { Op } = require('sequelize')
const helpers = require('../../_helpers')

const adminController = {
  /* admin 登入 */
  getAdminSignInPage: (req, res, next) => {
    try {
      if (helpers.ensureAuthenticated(req)) {
        return res.redirect('/admin')
      }

      return res.render('admin/signin')
    } catch (error) {
      return next(error)
    }
  },

  adminSignin: (req, res, next) => {
    try {
      return res.redirect('/admin/tweets')
    } catch (error) {
      return next(error)
    }
  },

  adminLogout: (req, res, next) => {
    try {
      req.logout(function (err) {
        if (err) {
          return next(err)
        }

        req.flash('success_messages', '你已成功登出!')

        res.redirect('/admin/signin')
      })
    } catch (error) {
      return next(error)
    }
  },
  /* admin登入結束 */

  getAdminHomePage: async (req, res, next) => {
    return res.redirect('/admin/tweets')
  },

  getTweets: async (req, res, next) => {
    try {
      let tweets = await Tweet.findAll({
        include: {
          model: User,
          required: true
        },
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })

      tweets = tweets.map(tweet => {
        if (tweet.description.length > 50) {
          tweet.description = tweet.description.substring(0, 50) + '...'
        } else {
          tweet.description = tweet.description.substring(0, 50)
        }
        return tweet
      })

      res.render('admin/tweets', { tweets, route: 'tweets' })
    } catch (error) {
      return next(error)
    }
  },

  getUsers: async (req, res, next) => {
    try {
      const backendUsers = await User.findAll({
        // 使用者需要看到所有用戶，包含root帳號
        attributes: [
          'id',
          'name',
          'account',
          'avatar',
          'role',
          'cover',
          [sequelize.literal('( SELECT COUNT(*) FROM Tweets WHERE Tweets.user_id = User.id)'), 'tweetCount'],
          [sequelize.literal('( SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount'],
          [sequelize.literal('( SELECT COUNT(*) FROM Followships WHERE Followships.follower_id = User.id)'), 'followingCount'],
          [sequelize.literal('( SELECT COUNT(*) FROM Likes WHERE Likes.user_id = User.id)'), 'likeCount']
        ],
        order: [['tweetCount', 'DESC']],
        raw: true
      })

      res.render('admin/users', { users: backendUsers, route: 'users' })
    } catch (error) {
      return next(error)
    }
  },

  deleteTweets: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      await Tweet.destroy({
        where: {
          id: tweetId
        }
      })
      req.flash('success_messages', '刪除成功！')
      return res.redirect('back')
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = adminController
