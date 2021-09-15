const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const helpers = require('../_helpers')

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
            req.flash('error_messages', '此帳號非管理者帳號！')
            return res.redirect('/admin/login')
        }
        res.redirect('/admin/login')
    }

    const authenticatedUser = (req, res, next) => {
        if (req.isAuthenticated()) {
            if (!req.user.isAdmin) { return next() }
            req.flash('error_messages', '此帳號為管理者帳號，不可登入前台！')
            return res.redirect('/users/login')
        }
        res.redirect('/users/login')
    }

    // test route
    app.get('/', (req, res) => {return res.render('setting')})
    // test route end
    app.get('/users/register', userController.signUpPage)
    app.post('/users/register', userController.signUp)
    app.get('/users/login', userController.signInPage)
    app.post('/users/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }), userController.signIn)
    app.get('/users/logout', userController.logout)
    app.get('/users/setting/:id', authenticatedUser, userController.getSetting)

    app.get('/admin/login', adminController.signInPage)
    app.post('/admin/login', passport.authenticate('local', { failureRedirect: '/admin/login', failureFlash: true }), adminController.signIn)
    app.get('/admin/logout', adminController.logout)
    app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)

}