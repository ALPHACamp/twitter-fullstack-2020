const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const passport = require('passport')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  // Index page
  //app.get('/newsFeed', authenticated, (req, res) => res.render('newsFeed'))
  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, tweetController.getTweets)
  app.post('/tweets', authenticated, tweetController.postTweet)

  app.get('/tweets/:id', tweetController.getTweet)
  app.post('/tweets/:id/replies', tweetController.postReply)

  //user profile route controller
  app.get('/api/users/:id', authenticated, userController.getUser)
  app.get('/api/users/:id/edit', authenticated, userController.editUser)
  app.post('/api/users/:id', authenticated, upload.fields([{ name: 'avatar' }, { name: 'cover' }]), userController.postUser) //must to add middleware of upload.single('') because of enctype="multipart/form-data"
  //user followship
  app.post('/followships/:userId', authenticated, userController.addFollowing)
  app.delete('/followships/:userId', authenticated, userController.removeFollowing)
  //followship page
  app.get('/users/:id/followers', authenticated, userController.getFollowers)
  app.get('/users/:id/followings', authenticated, userController.getFollowings)

  // sign in / sign out / sign up
  app.get('/signUp', userController.signUpPage)
  app.post('/signUp', userController.signUp)
  app.get('/signIn', userController.signInPage)
  app.post('/signIn', passport.authenticate('local', { failureRedirect: '/signIn', failureFlash: true }), userController.signIn)
  app.get('/signOut', authenticated, userController.signOut)

  app.get('/admin/signIn', (req, res) => res.render('./admin/signIn'))
  app.post('/admin/signIn', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err) }
      if (user.role !== '1') {
        console.log(user)
        req.flash('error_messages', 'The account is not admin. Please sign in with users sign in page.')
        return res.redirect('/admin/signIn')
      }
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        return res.redirect('/admin/twitters/')
      })
    })(req, res, next)
  })
}
