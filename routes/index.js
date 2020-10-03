const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const tweetController = require('../controllers/tweetController')

module.exports = (app, passport) => {

  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {  
      return next()
    }
    res.redirect('/signin')
  }

  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAmin) { return next() }  
      return res.redirect('/') 
    }
    res.redirect('/signin')
  }

  //user login
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }), userController.signIn)
  app.get('/logout', userController.logout)
  app.get('/main', (req, res) => res.render('mainpage'))


  // adminController
  app.get('/admin', (req, res) => { res.redirect('/admin/tweets') })
  app.get('/admin/tweets', adminController.getTweets)
  app.delete('/admin/tweets/:id', adminController.deleteTweet)
  app.get('/admin/users', adminController.getUsers)
  app.get('/admin/signin', adminController.signinPage)
  app.post('/admin/signin', adminController.signIn)


  // tweetController
app.get("/", (req, res) => res.redirect("/tweets"));
app.get("/tweets", tweetController.getTweets);
}



// const userController = require('../controllers/userController')
// const adminController = require('../controllers/adminController')
// module.exports = (app, passport) => {

//   const authenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {  
//       if (req.user.role === "1") { return next() }
//       return res.redirect('/')
//     }
//     res.redirect('/signin')
//   }

//   const authenticatedAdmin = (req, res, next) => {
//     if (req.isAuthenticated()) {
//       if (req.user.role === "0") { return next() } 
//       return res.redirect('/') 
//     }
//     res.redirect('/signin')
//   }
//   //user login
//   app.get('/signup', userController.signUpPage)
//   app.post('/signup', userController.signUp)
//   app.get('/signin', userController.signInPage)
//   app.post('/signin', passport.authenticate('local', {
//     failureRedirect: '/signin',
//     failureFlash: true
//   }), userController.signIn)
//   app.get('/main', (req, res) => res.render('mainpage'))
//   app.get('/main', authenticated, (req, res) => res.render('mainpage'))


//   // adminController
  
//   app.get('/admin', authenticatedAdmin, (req, res) => { res.redirect('/admin/tweets') })
//   app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
//   app.post('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)

//   app.get('/admin/users', authenticatedAdmin, adminController.getUsers)

//   app.get('/admin/signin', adminController.signinPage)
//   app.post('/admin/signin', passport.authenticate('local', {
//     failureRedirect: '/signin',
//     failureFlash: true
//   }), adminController.signIn)
//   app.get('/logout', userController.logout)

// } 