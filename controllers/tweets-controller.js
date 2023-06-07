const tweetsController = {
  getTweets: (req, res, next) => {
    return res.render('tweets')
  },
  getTweet: (req, res, next) => {
    return res.render('tweet')
  }
}

module.exports = tweetsController
