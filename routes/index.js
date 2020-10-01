// const adminController = require('../controllers/adminController.js')
// const userController = require('../controllers/userController.js')

// module.exports = (app, passport) => {

//     const authenticated = (req, res, next) => {
//         if (req.isAuthenticated()) {  
//           return next()
//         }
//         res.redirect('/signin')
//       }
    
//       const authenticatedAdmin = (req, res, next) => {
//         if (req.isAuthenticated()) {
//           if (req.user.isAmin) { return next() }  
//           return res.redirect('/') 
//         }
//         res.redirect('/signin')
//       }

// app.get('/admin', (req, res) => { res.redirect('/admin/tweets') })
// app.get('/admin/tweets', adminController.getTweets)
// app.post('/admin/tweets/:id', adminController.deleteTweet)

//  app.get('/signup', userController.signUpPage)
//   app.post('/signup', userController.signUp)
//   app.get('/signin', userController.signInPage)
//   app.post('/signin', passport.authenticate('local', {
//     failureRedirect: '/signin',
//     failureFlash: true
//   }), userController.signIn)
//   app.get('/logout', userController.logout)
//   app.get('/main', (req, res) => res.render('mainpage'))

// }

const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')



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
  app.post('/admin/tweets/:id', adminController.deleteTweet)
  app.get('/admin/users', adminController.getUsers)
  app.get('/admin/signin', adminController.signinPage)
  app.post('/admin/signin', adminController.signIn)
}