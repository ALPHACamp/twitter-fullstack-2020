const userController = require('../controllers/userController')

module.exports = (app, passport) => { 
    const authenticated = (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/users/login')
    }

    const authenticatedAdmin = (req, res, next) => {
        if (req.isAuthenticated()) {
            if (req.user.isAdmin) { return next() }
            return res.redirect('/tweets')
        }
        res.redirect('/users/login')
    }

    const authenticatedUser = (req, res, next) => {
        if (req.isAuthenticated()) {
            if (!req.user.isAdmin) { return next() }
            return res.redirect('/admin/tweets')
        }
        res.redirect('/admin/login')
    }

    app.get('/users/register', userController.signUpPage)
    app.post('/users/register', userController.signUp)
    app.get('/users/login', userController.signInPage)
    app.post('/users/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }), userController.signIn)
    app.get('/users/logout', userController.logout)
    
}