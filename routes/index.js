const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const tweetController = require('../controllers/tweetController.js')
const helpers = require('../_helpers')

module.exports = (app, passport) => {
  //驗証使用者已登入
  /* const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (req.user.role === 'user') {
        return next()
      }
      return res.redirect('/admin')
    }
    res.redirect('/signin')
  }
  //驗証Admin已登入
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (req.user.role === 'admin') {
        return next()
      }
      return res.redirect('/')
    }
    res.redirect('/admin/signin')
  }*/
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect('/signin')
  }
  // 系統管理員認證
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).isAdmin) {
        return next()
      }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }
  //admin首頁
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))

  //admin登入
  app.get('/admin/signin', adminController.signInPage)
  app.post(
    '/admin/signin',
    passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }),
    adminController.signIn
  )
  app.get('/admin/logout', adminController.logout)

  //admin管理推文
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)

  //admin管理使用者
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)

  //user首頁
  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))

  //user登入
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)

  //user註冊
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  //user編輯帳號
  app.get('/users/:id/edit', authenticated, userController.editUser)
  app.put('/users/:id/', authenticated, userController.putUser)

  //user推文
  app.get('/tweets', authenticated, tweetController.getTweets)
  //user推文
  app.get('/tweets/:id/replies', authenticated, tweetController.getTweet)

  //user喜歡推文
  app.post('/tweets/:id/like', authenticated, userController.addLike)
  //user移除喜歡推文
  app.post('/tweets/:id/unlike', authenticated, userController.removeLike)

  //user追隨
  app.post('/followships', authenticated, userController.addFollowships)
  //user取消追隨
  app.delete('/followships/:id', authenticated, userController.removeFollowing)
}
