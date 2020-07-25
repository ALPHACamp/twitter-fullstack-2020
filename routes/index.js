const tweetController = require('../controllers/tweetController')

module.exports = app => {
  app.get('/', (req, res) => res.redirect('/tweets'))
  app.get('/tweets', tweetController.getTweets)
  app.post('/tweets', tweetController.postTweet)

  app.get('/tweets/:id', tweetController.getTweet)
  app.post('/tweets/:id/replies', tweetController.postReply)
}
