const tweetController = require('../controllers/tweetController')
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const profileUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])
const { userAuthenticated, adminAuthenticated, authenticatedStatus } = require('../config/authenticate')

module.exports = (app, passport) => {
  const userSignIn = passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true })
  const adminSignIn = passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true })

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  app.get('/signin', userController.signInPage)
  app.post('/signin', userSignIn, userController.signIn)

  app.get('/admin/signin', adminController.signInPage)
  app.post('/admin/signin', adminSignIn, adminController.signIn)
  app.get('/admin/tweets', adminAuthenticated, adminController.getTweets)
  app.get('/admin/users', adminAuthenticated, adminController.getUsers)

  app.get('/logout', userController.logout)
  app.get('/', authenticatedStatus, userController.getIndexPage)

  app.get('/tweets', userAuthenticated, tweetController.getTweets)
  app.post('/tweets', userAuthenticated, tweetController.postTweet)
  app.post('/tweets/:id/like', userAuthenticated, tweetController.addLike)
  app.delete('/tweets/:id/like', userAuthenticated, tweetController.removeLike)
  app.get('/tweets/:id', userAuthenticated, tweetController.getTweet)
  app.delete('/tweets/:id', adminAuthenticated, adminController.deleteTweet)
  app.post('/tweets/:id/replies', userAuthenticated, tweetController.postReply)

  app.get('/api/users/:id', userAuthenticated, userController.editUser)
  app.post('/api/users/:id', userAuthenticated, profileUpload, userController.putUserProfile)
  app.put('/api/users/:id', userAuthenticated, userController.putUser)

  app.get('/users/:id/tweets', userAuthenticated, userController.getTweets)
  app.get('/users/:id/likes', userAuthenticated, userController.getLikes)
  app.get('/users/:id/replies', userAuthenticated, userController.getReplies)
  app.get('/users/:id/followings', userAuthenticated, userController.getFollowings)
  app.get('/users/:id/followers', userAuthenticated, userController.getFollowers)

  app.post('/followships/:id', userAuthenticated, userController.addFollow)
  app.delete('/followships/:id', userAuthenticated, userController.removeFollow)
}
