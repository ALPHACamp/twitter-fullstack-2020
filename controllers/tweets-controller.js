const tweetsController = {
  getTweets: (req, res, next) => {
    res.render('tweets')
  },
  getTweet: (req, res, next) => {
    res.render('tweet')
  }
}

module.exports = tweetsController
