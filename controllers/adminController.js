const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const pageLimit = 30


const adminControllers = {
  getTweets: (req, res) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [{ model: User }]
    })
      .then(tweets => {
        console.log(tweets)
        tweets = tweets.map(tweet => ({
          ...tweet,
          description: tweet.description.substring(0, 200),
        }))
        console.log(tweets)
        return res.render('admin/tweets', { tweets })
      })
  }
}

module.exports = adminControllers