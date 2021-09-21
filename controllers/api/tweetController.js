const moment = require('moment')
const db = require('../../models')
const Tweet = db.Tweet
const User = db.User

const tweetController = {
  getModalTweet: async (req, res) => {
    try {
      const tweet = await Tweet.findByPk(req.params.tweetId, {
        include: User
      })
      const tweetModal = tweet.toJSON()
      tweetModal.createdAt = moment(tweetModal.createdAt).fromNow()
      res.json({ tweetModal })
    } catch(err) {
      console.warn(err)
    }
  }
}

module.exports = tweetController