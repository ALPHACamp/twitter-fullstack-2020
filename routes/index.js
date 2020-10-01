const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const tweetController = require('../controllers/tweetController')
const helpers = require('../_helpers');

// const authenticated = (req, res, next) => {
//   if (helpers.ensureAuthenticated(req)) {
//     return next()
//   }
//   res.redirect('/users/login')
// }

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (req.user.role === 'user') { return next() }
    }
    req.flash('error_messages', '錯誤賬號類型，請使用後台登錄！')
    return res.redirect('/users/login')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      console.log(req.user)
      if (req.user.role === 'admin') { return next() }
      return res.redirect('/users/login')
    }
    res.redirect('/users/login')
  }

  app.get('/tweets', authenticated, (req, res) => { return res.render('tweets') })
  //admin pages
  app.get('/admin/tweets', authenticatedAdmin, adminController.adminTweets)
  //user login 
  app.get('/', (req, res) => { return res.redirect('/tweets') })
  app.get('/users/login', userController.loginPage)
  app.post('/users/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }), userController.login)
  app.get('/users/register', userController.registerPage)
  app.post('/users/register', userController.register)
  app.get('/users/logout', userController.logout)

  //admin login
  app.get('/admin/login', adminController.adminLoginPage)
  app.post('/admin/login', passport.authenticate('local', { failureRedirect: '/admin/login', failureFlash: true }), adminController.adminLogin)
  app.get('/admin/logout', adminController.adminLogout)

  app.get('/tweets', tweetController.getTweets)
  app.get('/users/settings', authenticated, userController.settingsPage)
  app.get('/users/logout', userController.logout)
}