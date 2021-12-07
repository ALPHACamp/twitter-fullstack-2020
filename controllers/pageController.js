const helpers = require('../_helpers')
const db = require('../models')
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

  getIndex: async (req, res) => {
    try {
      if (helpers.getUser(req).role === 'admin') {
        req.flash('error_messages', '你無法瀏覽此頁面')
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

  getSettings: async (req, res) => {
    try {
      if (helpers.getUser(req).id !== Number(req.params.userId)) {
        req.flash('error_messages', '你無法瀏覽此頁面')
        return res.redirect('/tweets')
      }

      const loginUser = await userController.getLoginUser(req, res)

      return res.render('user', { loginUser, userSettingsPage: true })
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
      return res.render('user', {
        loginUser,
        user,
        tweets,
        userTweetsPage: true
      })
    } catch (err) {
      console.error(err)
    }
  },

  getUserReplies: async (req, res) => {
    try {
      const [loginUser, user, replies] = await Promise.all([
        userController.getLoginUser(req, res),
        userController.getUserProfile(req, res),
        userController.getUserReplies(req, res)
      ])
      return res.render('user', {
        loginUser,
        user,
        replies,
        userRepliesPage: true
      })
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
      return res.render('user', {
        loginUser,
        user,
        tweets,
        userLikesPage: true
      })
    } catch (err) {
      console.error(err)
    }
  },

  getUserFollowers: async (req, res) => {
    try {
      const [loginUser, user, followers] = await Promise.all([
        userController.getLoginUser(req, res),
        userController.getUserProfile(req, res),
        userController.getUserFollowers(req, res)
      ])
      return res.render('user', {
        loginUser,
        user,
        followers,
        userFollowersPage: true
      })
    } catch (err) {
      console.error(err)
    }
  },

  getUserFollowings: async (req, res) => {
    try {
      const [loginUser, user, followings] = await Promise.all([
        userController.getLoginUser(req, res),
        userController.getUserProfile(req, res),
        userController.getUserFollowings(req, res)
      ])
      return res.render('user', {
        loginUser,
        user,
        followings,
        userFollowingsPage: true
      })
    } catch (err) {
      console.error(err)
    }
  }

  // getAdminTweets: async (req, res) => {

  // },

  // getAdminUsers: async (req, res) => {

  // }
}

module.exports = pageController
