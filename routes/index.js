const userController = require('../controllers/userController.js')
const tweetController = require('../controllers/tweetController')
const adminController = require('../controllers/adminController')

module.exports = app => {
  app.get('/', (req, res) => { res.redirect('/tweets') })
  app.get('/tweets', tweetController.getTweets)
  app.get('/tweets/:id', tweetController.getTweet)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  //admin
  app.get('/admin/tweets', adminController.getTweets)
}
