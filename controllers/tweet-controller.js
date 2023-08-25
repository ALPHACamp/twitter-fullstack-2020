// const { Tweet } = require('../models')

const tweetController = {
  getTweets: (req, res, next) => {
    res.render('tweets')
  }
}
module.exports = tweetController
