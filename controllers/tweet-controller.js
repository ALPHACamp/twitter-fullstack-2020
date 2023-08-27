const { Tweet, User } = require('../models')

const tweetController = {
  getTweets: (req, res, next) => {
    const tweetRoute = true
    Tweet.findAll({
      raw: true,
      nest: true,
      include: User,
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        if (!tweets) throw new Error('Tweets do not exist!')
        res.render('tweets', { tweets, tweetRoute })
      })
      .catch(err => next(err))
  }
}
module.exports = tweetController
