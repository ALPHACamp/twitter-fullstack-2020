const { Tweet } = require('../models')

const tweetController = {
//  add controller action here
  getTweets: (req, res, next) => {
    Tweet.findAll({ raw: true })
      .then(tweet => res.render('tweets', { tweet }))
  },
  getTweetsReply: (req, res, next) => {
    Tweet.findAll({ raw: true })
      .then(tweet => res.render('replies', { tweet }))
  }

}

module.exports = tweetController
