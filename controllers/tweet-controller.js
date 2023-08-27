const { Tweet, User } = require('../models')
const helper = require('../_helpers')
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
        res.render('tweets', { tweets, tweetRoute, id: helper.getUser(req).id })
      })
      .catch(err => next(err))
  }
}
module.exports = tweetController
