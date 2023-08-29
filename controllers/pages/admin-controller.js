const { User, Tweet, Like } = require('../../models')
const helpers = require('../../_helpers')

const adminController = {
  /* admin 登入 */
  getAdminSignInPage: (req, res, next) => {
    try {
      if (helpers.ensureAuthenticated(req)) return res.redirect('/admin')
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

        res.redirect('/admin/signin')
      })
    } catch (error) {
      return next(error)
    }
  },
  /* admin登入結束 */

  getAdminHomePage: async (req, res, next) => {
    res.redirect('/admin/tweets')
  },

  getTweets: async (req, res, next) => {
    try {
      let tweets = await Tweet.findAll({
        include: {
          model: User,
          required: true
        },
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

      res.render('admin/tweets', { tweets })
    } catch (error) {
      return next(error)
    }
  },

  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attribute: ['id', 'name', 'account', 'avatar'],
        include: [
          {
            model: Tweet,
            as: 'Tweets',
            attribute: ['id']
          },
          {
            model: User,
            as: 'Followers',
            attribute: ['id']
          },
          {
            model: User,
            as: 'Followings',
            attribute: ['id']
          },
          {
            model: Like,
            as: 'Likes',
            attribute: ['id']
          }
        ]
      })

      const backendUsers = users.map(user => {
        const tweetCount = user.Tweets.length
        const followerCount = user.Followers.length
        const followingCount = user.Followings.length
        const likeCount = user.Likes.length

        return {
          ...user.dataValues,
          tweetCount,
          followerCount,
          followingCount,
          likeCount
        }
      })

      res.render('admin/users', { users: backendUsers })
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
      return res.redirect('back')
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = adminController
