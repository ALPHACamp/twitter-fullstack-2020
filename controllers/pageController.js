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
      return res.json({ user, tweets })
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
      return res.json({ user, tweets })
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = pageController
