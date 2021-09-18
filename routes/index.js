const tweetController = require('../controllers/tweetController.js')
const adminController = require('../controllers/adminController.js')

module.exports = app => {
  app.get('/', (req, res) => res.redirect('/tweets'))
  // tweetController
  app.get('/tweets', tweetController.getTweets)
  app.get('/tweets/:id', tweetController.getTweet)
  app.post('/tweets', tweetController.postTweet)

  app.get('/admin', (req, res) => res.redirect('/admin/tweets'))
  app.get('/admin/tweets', adminController.getTweets)
  app.delete('/admin/tweets/:id', adminController.deleteAdminTweets)
  app.get('/admin/users', adminController.getUsers)
}