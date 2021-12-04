const helpers = require('../_helpers')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const adminController = require('../controllers/adminController')
const followshipController = require('../controllers/followshipController')
const pageController = require('../controllers/pageController')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    return res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return next()
      }
      return res.redirect('/tweets')
    }
    return res.redirect('/admin/signin')
  }

  // user 相關
  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, pageController.getIndex)
  // app.post('/tweets', authenticated)  // 發文

  // app.get('/api/users/:userId')  // 瀏覽編輯使用者頁面
  // app.post('/api/users/:userId')  // 更新使用者的資訊

  app.get('/users/:userId/tweets', authenticated, pageController.getUserTweets)
  app.get('/users/:userId/replies', authenticated, pageController.getUserReplies)
  // app.get('/users/:userId/likes', authenticated, userController.getUserLikes)
  // app.get('/users/:userId/followers', authenticated, userController.getUserFollowers)
  // app.get('/users/:userId/followings', authenticated, userController.getUserFollowings)

  app.get('/users/:userId/edit', authenticated, userController.editUserPage)
  app.put('/users/:userId', authenticated, userController.putUser)

  // followship 相關
  app.post('/followships', authenticated, followshipController.addFollow)
  app.delete('/followships/:userId', authenticated, followshipController.removeFollow)

  // tweet 相關
  app.post('/tweets', authenticated, tweetController.putTweet)
  app.post('/tweets/:tweetId/like', authenticated, tweetController.addLike)
  app.post('/tweets/:tweetId/unlike', authenticated, tweetController.removeLike)

  // reply 相關
  // app.get('/tweets/:tweetId/replies', authenticated)  // 取得留言資料
  // app.post('/tweets/:tweetId/replies')  // 新增留言

  // user 登入、登出、註冊
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/signout', userController.signOut)

  // admin 登入、登出
  app.get('/admin/signin', userController.signInPage)
  app.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), userController.signIn)
  app.get('/admin/signout', userController.signOut)

  // admin 相關
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  app.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
  app.get('/admin/users', authenticatedAdmin, adminController.adminUsers)
}
