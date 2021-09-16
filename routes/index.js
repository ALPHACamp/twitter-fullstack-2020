const tweetController = require('../controllers/tweetController.js')
const adminController = require('../controllers/adminController.js')

module.exports = app => {
  app.get('/', (req, res) => res.redirect('/tweets'))
  // tweetController
  app.get('/tweets', tweetController.getRestaurants)


  app.get('/admin', (req, res) => res.redirect('/admin/tweets'))
  app.get('/admin/tweets', adminController.getTweets)
}