const helpers = require('../../_helpers')
const db = require('../../models')
const { sequelize } = db
const { User, Tweet, Reply, Like, Followship } = db
const moment = require('moment')

const tweetController = {
  getTweet: async (req, res) => {
    try {
      let tweet = await Tweet.findByPk(req.params.tweetId, {
        include: [User]
      })
      tweet.dataValues.createdAt =  moment.updateLocale('zh-tw', { meridiem: tweet.dataValues.createdAt })
      tweet.dataValues.createdAt =  moment(tweet.dataValues.createdAt).fromNow()

      let loginUser = await User.findByPk(helpers.getUser(req).id, {
        attributes: [ 'id', 'avatar']
      })

      let data = {
        tweet,
        loginUser,
      }

      return res.json(data)
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = tweetController