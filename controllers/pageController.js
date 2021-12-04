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
      const user = await userController.getUser(req, res)
      const tweets = await tweetController.getTweets(req, res)
      return res.json({ user, tweets })
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = pageController
