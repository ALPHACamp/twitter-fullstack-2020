const { User, Tweet, sequelize } = require('../../models')
const helpers = require('../../_helpers')
const adminServices = require('../../service/admin-services')

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
      const limit = 12
      const firstPage = 0
      const tweets = await adminServices.getTweets(limit, firstPage)

      res.render('admin/tweets', { tweets, route: 'tweets' })
    } catch (error) {
      return next(error)
    }
  },
  getTweetsUnload: async (req, res, next) => {
    try {
      const { limit, page } = req
      const tweets = await adminServices.getTweets(limit, page)
      return res.json({ message: 'success', data: tweets })
    } catch (error) {
      return next(error)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const limit = 16
      const firstPage = 0
      const backendUsers = await adminServices.getUsers(limit, firstPage)

      res.render('admin/users', { users: backendUsers, route: 'users' })
    } catch (error) {
      return next(error)
    }
  },
  getUsersUnload: async (req, res, next) => {
    try {
      const { limit, page } = req
      const backendUsers = await adminServices.getUsers(limit, page)
      return res.json({ message: 'success', data: backendUsers })
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
