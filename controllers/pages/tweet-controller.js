const tweetController = {

  /* user home page */
  getUserTweets: (req, res, next) => {
    try {
      return res.render('main/tweets')
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = tweetController
