const { Tweet, User } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        console.log(helpers.getUser(req))
        return res.render('tweets', { tweets, user: helpers.getUser(req) })
      })
  }
}
module.exports = tweetController
