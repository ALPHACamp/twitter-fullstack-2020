const helpers = require('../_helpers')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')
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

  // tweet 相關
  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, pageController.getIndex)
  app.post('/tweets', authenticated, tweetController.addTweet) // 發文
  app.post('/tweets/:tweetId/like', authenticated, tweetController.addLike)
  app.post('/tweets/:tweetId/unlike', authenticated, tweetController.removeLike)
  app.get('/tweets/:tweetId/replies', authenticated, replyController.getReplies) // 取得留言資料
  // app.post('/tweets/:tweetId/replies')  // 新增留言

  // user 相關
  // app.get('/api/users/:userId')  // 瀏覽編輯使用者頁面
  // app.post('/api/users/:userId', userController.updateData)  // 更新使用者的資訊
  app.get('/users/:userId/settings', authenticated, pageController.getSettings)
  app.put('/users/:userId/settings', authenticated, userController.updateSettings)
  app.get('/users/:userId/tweets', authenticated, pageController.getUserTweets)
  app.get('/users/:userId/replies', authenticated, pageController.getUserReplies)
  app.get('/users/:userId/likes', authenticated, pageController.getUserLikes)
  app.get('/users/:userId/followers', authenticated, pageController.getUserFollowers)
  app.get('/users/:userId/followings', authenticated, pageController.getUserFollowings)
  app.post('/followships', authenticated, followshipController.addFollow)
  app.delete('/followships/:userId', authenticated, followshipController.removeFollow)

  // admin 相關
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  app.delete('/admin/tweets/:tweetId', authenticatedAdmin, adminController.deleteTweet)
  app.get('/admin/users', authenticatedAdmin, adminController.adminUsers)

  // 登入、登出、註冊
  app.get('/signup', pageController.getSignUp)
  app.get('/signin', pageController.getSignIn)
  app.get('/admin/signin', pageController.getSignIn)

  app.post('/signup', userController.signUp)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/signout', userController.signOut)
  app.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), userController.signIn)
  app.get('/admin/signout', userController.signOut)
}
