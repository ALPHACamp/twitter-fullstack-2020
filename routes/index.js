const adminController = require('../controllers/adminController')
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

  // 前台登入頁
  app.get('/login', userController.loginPage)
  // 後台登入頁
  app.get('/admin/login', adminController.loginPage)
}
