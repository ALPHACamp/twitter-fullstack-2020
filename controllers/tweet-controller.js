const { User, Tweet, Reply } = require('../models')

const tweetController = {
  getTweets: (req, res) => {
    const user = req.user
    return Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [User, Reply],
      nest: true
    })
      .then(tweets => {
        tweets = tweets.map(tweet => ({
          replyCount: tweet.Replies.length,
          ...tweet.toJSON()
        }))
        console.log(tweets)
        res.render('tweets', { user, tweets })})   
  }
}

module.exports = tweetController