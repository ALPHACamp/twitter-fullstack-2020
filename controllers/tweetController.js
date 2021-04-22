const { Tweet, Reply } = require('../models')

const tweetController = {
  getTweets: async (req, res) => {
    let tweets = await Tweet.findAll(
      {
        order: [['createdAt', 'DESC']]
      }
    )
    tweets = tweets.map((d, i) => ({
      ...d.dataValues,
    }))

    const pageTitle = '首頁'

    res.render('tweets', { tweets, pageTitle })
  }
}

module.exports = tweetController