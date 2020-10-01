const adminController = require('../controllers/adminController')
const tweetController = require('../controllers/tweetController')
const userController = require('../controllers/userController')

module.exports = (app, passport) => {

  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.role === 'user') {
        return next()
      } else {
        req.flash('error_messages', '請登入正確帳號!')
        return res.redirect('/login')
      }
    }
    res.redirect('/login')
  }

  const authenticatedAdmin = (req, res, next) => {
    console.log('SDFSDF')
    if (req.isAuthenticated()) {
      if (req.user.role === 'admin') {
        return next()
      } else {
        req.flash('error_messages', '請登入正確帳號!')
        return res.redirect('/admin/login')
      }
    }
    res.redirect('/admin/login')
  }

  app.get('/', authenticated, (req, res) => {
    res.redirect('/tweets')
  })

  // tweet首頁
  app.get('/tweets', authenticated, tweetController.getTweets)

  // 註冊頁
  app.get('/register', userController.registerPage)
  app.post('/register', userController.register)
  // 前台登入頁
  app.get('/login', userController.loginPage)
  // 前台登入
  app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }), userController.login)

  app.get('/logout', userController.logout)


  // 後台登入頁
  app.get('/admin/login', adminController.loginPage)
  // 後台登入 
  app.post('/admin/login', passport.authenticate('local', {
    failureRedirect: '/admin/login',
    failureFlash: true
  }), adminController.login)

  app.get('/admin', authenticatedAdmin, (req, res) => {
    res.redirect('/admin/tweets')
  })
  // 後台推文清單
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  // 刪除後台推文
  app.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
  // 後台使用者清單
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  // 後台登出
  app.get('/admin/logout', adminController.logout)
}
