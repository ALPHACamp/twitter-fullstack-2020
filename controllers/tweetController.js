let tweetController = {
  getTweets: (req, res) => {
    return res.render('tweets')
  },
  getTweet: (req, res) => {
    return res.render('tweet')
  }
}

module.exports = tweetController