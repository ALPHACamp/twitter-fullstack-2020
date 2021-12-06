const helpers = require('../_helpers')
const db = require('../models')
const { sequelize } = db
const { Op } = db.Sequelize
const { User, Tweet, Reply, Like, Followship } = db
const userController = require('./userController')
const tweetController = require('./tweetController')

const pageController = {
  getSignUp: (req, res) => {
    return res.render('signup')
  },

  getSignIn: (req, res) => {
    const isBackend = req.url.includes('admin')
    return res.render('signin', { isBackend })
  },

  getSettings: async (req, res) => {
    try {
      const UserId = Number(req.params.userId)

      if (helpers.getUser(req) !== UserId) {
        req.flash('error_messages', '你無權查看此頁面')
        return res.redirect('/tweets')
      }

      return res.render('settings')
    } catch (err) {
      console.error(err)
    }
  },

  getIndex: async (req, res) => {
    try {
      if (helpers.getUser(req).role === 'admin') {
        req.flash('error_messages', '無法瀏覽此頁面')
        return res.redirect('/admin/tweets')
      }

      const [loginUser, tweets] = await Promise.all([
        userController.getLoginUser(req, res),
        tweetController.getTweets(req, res)
      ])

      return res.render('user', { loginUser, tweets, indexPage: true })
    } catch (err) {
      console.error(err)
    }
  },

  getUserTweets: async (req, res) => {
    try {
      const [loginUser, user, tweets] = await Promise.all([
        userController.getLoginUser(req, res),
        userController.getUserProfile(req, res),
        userController.getUserTweets(req, res)
      ])

      // return res.json({ loginUser, user, tweets, userTweetsPage: true })
      return res.render('user', { loginUser, user, tweets, userTweetsPage: true })
    } catch (err) {
      console.error(err)
    }
  },

  getUserReplies: async (req, res) => {
    // 不熟 sequelize 待優化，邏輯：reply -> tweet -> user -> account(field)
    try {
      const [loginUser, user, replies] = await Promise.all([
        userController.getLoginUser(req, res),
        userController.getUserProfile(req, res),
        userController.getUserReplies(req, res)
      ])
      // return res.json({ loginUser, user, replies, userRepliesPage: true })
      return res.render('user', { loginUser, user, replies, userRepliesPage: true })
    } catch (err) {
      console.error(err)
    }
  },

  getUserLikes: async (req, res) => {
    try {
      const [loginUser, user, tweets] = await Promise.all([
        userController.getLoginUser(req, res),
        userController.getUserProfile(req, res),
        userController.getUserLikes(req, res)
      ])
      return res.render('user', { loginUser, user, tweets, userLikesPage: true })
      // return res.json({ loginUser, user, tweets, userLikesPage: true })
    } catch (err) {
      console.error(err)
    }
  },

  getUserFollowers: async (req, res) => {
    try {
      const [user, followers] = await Promise.all([
        userController.getUserProfile(req, res),
        userController.getUserFollowers(req, res)
      ])
      return res.render('user', { user, followers, userFollowersPage: true })
      // return res.json({ user, followers, userFollowersPage: true })
    } catch (err) {
      console.error(err)
    }
  },

  getUserFollowings: async (req, res) => {
    try {
      const [user, followings] = await Promise.all([
        userController.getUserProfile(req, res),
        userController.getUserFollowings(req, res)
      ])
      // return res.render('user', { user, followings, userFollowingsPage: true })
      return res.json({ user, followings, userFollowingsPage: true })
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = pageController
