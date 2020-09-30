const tweetsController = require('../controllers/tweetController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController')
const passport = require('../config/passport')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')

module.exports = app => {
  //如果使用者訪問首頁，就導向 /restaurants 的頁面
  app.get('/', (req, res) => res.redirect('/tweets'))
  //在 /restaurants 底下則交給 restController.getRestaurants 來處理
  app.get('/tweets', tweetsController.getTweets)

  //=====================admin====================================
  // 連到 /admin 頁面就轉到 /admin/restaurants
  app.get('/admin', (req, res) => res.redirect('/admin/tweets'))
  // 在 /admin/restaurants 底下則交給 adminController.getRestaurants 處理
  app.get('/admin/tweets', adminController.getTweets)

  app.get('/admin/signin', adminController.signInPage)
  app.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), authenticatedAdmin, adminController.signIn)
  app.get('/admin/logout', adminController.logout)

  app.get('/register', userController.registerPage)
  app.post('/register', userController.register)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), authenticated, userController.signIn)
  app.get('/logout', userController.logout)
}
