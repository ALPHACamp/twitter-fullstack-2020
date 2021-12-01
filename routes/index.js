
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')

module.exports = (app, passport) => {
  // ADMIN

  // OTHERS

  // USER

  // TWEET
  app.get('/', (req, res) => res.redirect('/tweets'))
  app.get('/tweets', tweetController.getTweets)

  // REPLY

  // LIKE

  // FOLLOWSHIP
}