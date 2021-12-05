const helpers = require('../_helpers')
const bcrypt = require('bcryptjs')

const db = require('../models')
const { sequelize } = db
const { Op } = db.Sequelize
const { User, Tweet, Reply, Like, Followship } = db

const replyController = {
  getReplies: async (req, res) => {
    try {
      const TweetId = Number(req.params.tweetId)
      const replies = await Reply.findAll({
        where: { TweetId },
        attributes: ['id', 'comment', 'createdAt'],
        include: { model: User, attributes: ['id', 'name', 'avatar', 'account'] }
      })
      return res.json({ replies })
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = replyController
