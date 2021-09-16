const db = require('../models')
const Tweet = db.Tweet

const adminController = {
  getTweets: (req, res) => {
    return Tweet.findAll({ raw: true }).then(tweets => {
      return res.json(tweets)
    })
  },
  deleteAdminTweets: (req, res) => {
    return Tweet.findByPk(req.params.id).then((tweet) => {
      tweet.destroy().then(() => {
        return res.json({ status: 'success', tweet})
      })
    })
  }
}

module.exports = adminController