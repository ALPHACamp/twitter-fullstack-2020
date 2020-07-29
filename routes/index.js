const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const passport = require('passport')
const adminController = require('../controllers/adminController')
const { authenticate } = require('passport')
const helpers = require('../_helpers')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (!helpers.getUser(req).role) {
        return next()
      }
      return res.redirect('/admin/tweets')
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return next() 
      }
      return res.redirect('/tweets')
    }
    res.redirect('/signin')
  }

  // Index page
  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, tweetController.getTweets)
  app.post('/tweets', authenticated, tweetController.postTweet)
  // reply
  app.get('/tweets/:id', authenticated, tweetController.getTweet)
  app.post('/tweets/:id/replies', authenticated, tweetController.postReply)
  // like
  app.post('/tweets/:id/like', authenticated, tweetController.addLike)
  app.delete('/tweets/:id/like', authenticated, tweetController.removeLike)

  //user profile route controller
  app.get('/users/:id/tweets', authenticated, userController.getUser)
  app.get('/api/users/:id', authenticated, userController.editUser)
  app.post('/api/users/:id', authenticated, upload.fields([{ name: 'avatar' }, { name: 'cover' }]), userController.postUser) //must to add middleware of upload.single('') because of enctype="multipart/form-data"
  //user followship
  app.post('/followships/:userId', authenticated, userController.addFollowing)
  app.delete('/followships/:userId', authenticated, userController.removeFollowing)
  // followship page
  app.get('/users/:id/followers', authenticated, userController.getFollowers)
  app.get('/users/:id/followings', authenticated, userController.getFollowings)

  // admin backstage
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  app.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.get('/admin/setting/:id', authenticatedAdmin, userController.settingPage)
  app.post('/admin/setting/:id', authenticatedAdmin, userController.setting)
  app.get('/admin/signout', authenticatedAdmin, userController.signOut)

  // sign in / sign out / sign up
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/signout', authenticated, userController.signOut)

  app.get('/admin/signin', (req, res) => res.render('./admin/signin', {layout: 'blank'}))
  app.post('/admin/signin', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err) }
      if (user.role !== 'admin') {
        req.flash('error_messages', "If you're an user please signs in with user sign in page.")
        return res.redirect('/admin/signin')
      }
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        req.flash('success_messages', 'Signed in.')
        return res.redirect('/admin/tweets')
      })
    })(req, res, next)
  })

  // setting
  app.get('/setting/:id', authenticated, userController.settingPage)
  app.post('/setting/:id', authenticated, userController.setting)
}
