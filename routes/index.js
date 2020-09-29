const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const restController = require('../controllers/restController.js')

module.exports = app => {
  app.get('/admin', (req, res) => res.redirect('/admin/tweets'))
  app.get('/admin/tweets', adminController.getTweets)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/login', userController.logInPage)
  app.post('/login', userController.logIn)
  app.get('/logout', userController.logout)

  // 首頁
  app.get('/', restController.getmainPage)
  app.get('/main', restController.getmainPage)

  // setting使用者能編輯自己的 account、name、email 和 password
  app.get('/setting', restController.getSetting)
  app.put('/setting', restController.putSetting)


  // 使用者能編輯自己的自我介紹、個人頭像與封面
  app.get('/user/self', userController.getUser)
  app.get('/user/self/edit', userController.editUser)
  app.put('/users/:id', userController.putUser)
}