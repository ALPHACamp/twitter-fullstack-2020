const adminController = require('../controllers/adminController')
const tweetController = require('../controllers/tweetController')
const userController = require('../controllers/userController')

const helpers = require('../_helpers')

module.exports = (app, passport) => {

  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role !== 'admin') {
        return next()
      } else {
        req.flash('error_messages', '請登入正確帳號!')
        return res.redirect('/signin')
      }
    }
    res.redirect('/signin')
  }

  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return next()
      } else {
        req.flash('error_messages', '請登入正確帳號!')
        return res.redirect('/admin/signin')
      }
    }
    res.redirect('/admin/signin')
  }

  app.get('/', authenticated, (req, res) => {
    res.redirect('/tweets')
  })

  // tweet首頁
  app.get('/tweets', authenticated, tweetController.getTweets)

  // 註冊頁
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  // 前台登入頁
  app.get('/signin', userController.signInPage)
  // 前台登入
  app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }), userController.signIn)

  app.get('/signout', userController.signOut)


  // 後台登入頁
  app.get('/admin/signin', adminController.signInPage)
  // 後台登入 
  app.post('/admin/signin', passport.authenticate('local', {
    failureRedirect: '/admin/signin',
    failureFlash: true
  }), adminController.signIn)

  app.get('/admin', authenticatedAdmin, (req, res) => {
    res.redirect('/admin/tweets')
  })
  // 後台推文清單
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)

  // user 相關路由
  app.get('/users/:id', userController.getUser)
  // 刪除後台推文
  app.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
  // 後台使用者清單
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  // 後台登出
  app.get('/admin/signout', adminController.signOut)
}
