const helpers = require('../_helpers')
const db = require('../models')
const { sequelize } = db
const { Op } = db.Sequelize
const { User, Tweet, Reply, Like, Followship } = db
const userController = require('./userController')
const tweetController = require('./tweetController')

const pageController = {
  getIndex: async (req, res) => {
    try {
      const [user, tweets] = await Promise.all([
        userController.getUser(req, res),
        tweetController.getTweets(req, res)
      ])
      return res.render('user', { user, tweets, indexPage: true })
    } catch (err) {
      console.error(err)
    }
  },

  getUserTweets: async (req, res) => {
    try {
      const [user, tweets] = await Promise.all([
        userController.getUserProfile(req, res),
        userController.getUserTweets(req, res)
      ])
      return res.render('user', { user, tweets, userTweetsPage: true })
    } catch (err) {
      console.error(err)
    }
  },

  getUserReplies: async (req, res) => {
    try {
      const [user, replies] = await Promise.all([
        userController.getUserProfile(req, res),
        userController.getUserReplies(req, res)
      ])
      // 不熟 sequelize 待優化，邏輯：reply -> tweet -> user -> account(field)
      // return res.json({ user, replies, userRepliesPage: true })
      return res.render('user', { user, replies, userRepliesPage: true })
    } catch (err) {
      console.error(err)
    }
  },

  getUserLikes: async (req, res) => {
    try {
      const [user, tweets] = await Promise.all([
        userController.getUserProfile(req, res),
        userController.getUserLikes(req, res)
      ])
      return res.json({ user, tweets, userLikesPage: true })
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
      return res.json({ user, followers, userFollowerPage: true})
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
      return res.json({ user, followings, userFollowingPage: true })
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = pageController
