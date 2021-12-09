const helpers = require('../../_helpers')
const db = require('../../models')
const { User, Tweet } = db
const moment = require('moment')

const tweetController = {
  getTweet: async (req, res) => {
    try {
      const tweet = await Tweet.findByPk(req.params.tweetId, {
        include: [User]
      })
      tweet.dataValues.createdAt = moment.updateLocale('zh-tw', {
        meridiem: tweet.dataValues.createdAt
      })
      tweet.dataValues.createdAt = moment(tweet.dataValues.createdAt).fromNow()

      const loginUser = await User.findByPk(helpers.getUser(req).id, {
        attributes: ['id', 'avatar']
      })

      const data = {
        tweet,
        loginUser
      }

      return res.json(data)
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = tweetController
