const { Tweet, User } = require('../models')
const { getTop10Following } = require('../helpers/getTop10Following-helper')
const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        include: [User]
      })
      const top10Followers = await getTop10Following(req, next)
      const sortedTweets = tweets.sort((a, b) => b.createdAt - a.createdAt)
      return res.render('tweets', {
        tweets: sortedTweets,
        topFollowers: top10Followers
      })
    } catch (err) {
      next(err)
    }
  },
  postTweet: async (res, req, nex) => {}
}

module.exports = tweetController
