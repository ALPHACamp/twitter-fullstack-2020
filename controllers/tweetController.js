const { Tweet, User, Reply } = require('../models')

const tweetController = {
  getTweets: async (req, res) => {
    const tweets = await Tweet.findAll({
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [User]
    })
    const Appear = { navbar: true, top10: true }
    return res.render('tweets', { tweets, Appear })
  },
  getTweet: async (req, res) => {
    const tweet = await Tweet.findByPk(req.params.id, {
      include: [
        User,
        { model: Reply, include: [User] }
      ]
    })
    // console.log('into controllers/tweetControllers/line22...tweet', tweet.toJSON())
    return res.render('tweet', { tweet: tweet.toJSON() })
  }
}

module.exports = tweetController