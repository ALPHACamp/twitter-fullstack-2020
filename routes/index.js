const userController = require('../controllers/userController')

module.exports = (app, passport)=> {
    app.get('/users/register', userController.signUpPage)
    app.post('/users/register', userController.signUp)
    app.get('/users/login', userController.signInPage)
    app.post('/users/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }), userController.signIn)
    app.get('/users/logout', userController.logout)
}   