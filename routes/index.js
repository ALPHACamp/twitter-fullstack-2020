
const userController = require('../controllers/userController.js')
const restController = require('../controllers/restController.js')
module.exports = (app) => {

  //如果使用者訪問首頁，就導向 /main 的頁面
  app.get('/', (req, res) => res.redirect('/setting'))

  //在 /restaurants 底下則交給 restController.getRestaurants 來處理
  app.get('/setting', restController.getSettings)


  // 註冊頁面
  app.get('/regist', userController.registPage)
  app.post('/regist', userController.regist)
  // 登入頁面
  app.get('/login', userController.logInPage)
  app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.logIn)
  app.get('/logout', userController.logout)
}