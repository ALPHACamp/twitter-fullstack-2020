const tweetController = require('../controllers/tweetController')
const userController = require('../controllers/userController')

module.exports = app => {

  app.get('/', (req, res) => {
    res.redirect('/tweets')
  })

  // tweet首頁
  app.get('/tweets', tweetController.getTweets)


  // 註冊頁
  app.get('/register', userController.registerPage)
}
