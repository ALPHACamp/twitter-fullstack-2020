const { Tweet, User } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    return Promise.all([
      Tweet.findAll({
        raw: true,
        nest: true,
        include: [User],
        order: [['createdAt', 'DESC']]
      }),
      User.findAll({
        raw: true
      })
    ])
      .then(([tweets, users]) => {
        return res.render('tweets', { tweets, users, user: helpers.getUser(req) })
      })
  }
}
module.exports = tweetController
