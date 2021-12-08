const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])
const helpers = require('../_helpers')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect('/signin')
  }

  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, (req, res) => res.render('tweets', { user: helpers.getUser(req) }))

  app.get('/users/:userId/tweets', authenticated, userController.getUserTweets)
  
  //瀏覽編輯使用者頁面
  app.get('/api/users/:userId', userController.getUser)
  //更新使用者資訊
  app.post('/api/users/:userId', cpUpload, userController.postUser)

  //設定前台流覽總推文路由
  app.get('/tweets', authenticated, tweetController.getTweets)

  //設定前台瀏覽個別推文路由
  app.get('/tweets/:id/replies', authenticated, tweetController.getTweet)


  // like tweet
  app.post('/tweets/:tweetId/like', authenticated, userController.addLike )
  // unlike tweet
  app.post('/tweets/:tweetId/unlike', authenticated, userController.removeLike)
  // following
  app.post('/followships/:followingId', authenticated, userController.addFollowing)
  // removeFollowing
  app.delete('/followships/:followingId', authenticated, userController.removeFollowing)
  
  //設定使用者個人資料路由
  app.get('/users/:userId/tweets', authenticated, userController.getUserTweets)

  //設定使用者個人資料頁面推文與回覆路由
  app.get('/users/:userId/replies', authenticated, userController.getUserReplies)

  //新增推文
  app.post('/tweets', authenticated, tweetController.postTweet)

  //新增留言
  app.post('/tweets/:tweetId/replies', authenticated, replyController.postRelpy)

  // login
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)
}