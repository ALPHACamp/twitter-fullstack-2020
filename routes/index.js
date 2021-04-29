const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const adminController = require('../controllers/adminController')
const { authenticated, adminAuthenticated } = require('../middleware/auth')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

module.exports = (app, passport) => {
  // 管理者登入
  app.get('/admin/signin', adminController.signInPage)
  app.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), adminController.signIn)

  // 使用者登入
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)

  // 管理者 tweets
  app.get('/admin/tweets', adminAuthenticated, adminController.getTweets)
  app.delete('/admin/tweets/:id', adminAuthenticated, adminController.deleteTweets)

  // 管理者 users
  app.get('/admin/users', adminAuthenticated, adminController.getUsers)

  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  //tweet
  app.get('/tweets', authenticated, tweetController.getTweets)
  //replies

  app.get('/tweets/:id/reply', authenticated, tweetController.getAddReply)
  app.post('/tweets/:id/reply', authenticated, tweetController.addReply)
  //like
  app.post('/tweets/:id/like', authenticated, tweetController.likeTweet)
  app.delete('/tweets/:id/like', authenticated, tweetController.unlikeTweet)
  app.get('/tweets/new', authenticated, tweetController.getAddTweet)
  app.post('/tweets', authenticated, tweetController.addTweet)
  app.get('/tweets/:id', authenticated, tweetController.getTweet)


  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)

  // 更新個人資訊
  app.put('/users/:id/edit', authenticated, upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), userController.putEdit)

  app.get('/users/setting', authenticated, userController.settingPage)
  app.put('/users/setting', authenticated, userController.putSetting)
  app.post('/users/:id/follow', authenticated, userController.followUser)
  app.delete('/users/:id/follow', authenticated, userController.unfollowUser)
  app.get('/users/top', authenticated, userController.getTopUsers)
  app.get('/users/:id/followers', authenticated, userController.getFollowers)
  app.get('/users/:id/followings', authenticated, userController.getFollowings)
  app.get('/users/:id/like', authenticated, userController.getLikes)

  //個人頁面
  app.get('/users/:id/tweets', authenticated, userController.getProfile)
  app.get('/users/:id/likes', authenticated, userController.getProfile)
  app.get('/users/:id/replies', authenticated, userController.getProfile)
  app.get('/users/:id/likemost', authenticated, userController.getProfile)
  app.get('/users/:id/replymost', authenticated, userController.getProfile)

  //搜尋使用者
  app.get('/users/search', authenticated, userController.search)
}



