const passport = require('../config/passport')

const userController = require('../controllers/userController')


module.exports = (app, passport) => {
  app.get('/users/login', userController.loginPage)
  app.post('/users/login', passport.authenticate('local',
  { failureRedirect: '/users/login', failureFlash: true }), userController.login)
}