const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')

module.exports = (app, passport) => {

  app.get('/', (req, res) => { return res.render('index') })
  app.get('/users/login', userController.loginPage)
  app.post('/users/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }), userController.login)
  app.get('/users/register', userController.registerPage)
  app.post('/users/register', userController.register)
  app.get('/users/logout', userController.logout)

  app.get('/admin/login', adminController.adminLoginPage)
  app.post('/admin/login', passport.authenticate('local', { failureRedirect: '/admin/login', failureFlash: true }), adminController.adminLogin)
  app.get('/admin/logout', adminController.adminLogout)
}