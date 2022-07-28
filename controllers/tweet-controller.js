const tweetServices = require('../services/tweet-services')

const tweetController = {
  getTweets: (req, res, next) => {
    tweetServices.getFollowing(req, (err, users, next) => err ? next(err) : res.render('index', { users: users.users }))
  }
}

module.exports = tweetController
