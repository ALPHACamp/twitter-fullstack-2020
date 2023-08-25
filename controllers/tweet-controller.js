// const { Tweet } = require('../models')

const tweetController = {
  getTweets: (req, res, next) => {
    // test sidebar view
    res.render('tweets')
  }
}
module.exports = tweetController
