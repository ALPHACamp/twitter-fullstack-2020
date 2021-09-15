const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const helpers = require('../_helpers')

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
            req.flash('error_messages', '此帳號非管理者帳號！')
            return res.redirect('/admin/login')
        }
        res.redirect('/admin/login')
    }

    const authenticatedUser = (req, res, next) => {
        if (req.isAuthenticated()) {
            if (!req.user.isAdmin) { return next() }
            req.flash('error_messages', '此帳號為管理者帳號，不可登入前台！')
            return res.redirect('/signin')
        }
        res.redirect('/signin')
    }

    // test route
    app.get('/', (req, res) => {return res.render('setting')})
    // test route end
    app.get('/signup', userController.signUpPage)
    app.post('/signup', userController.signUp)
    app.get('/signin', userController.signInPage)
    app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
    app.get('/users/logout', userController.logout)
    app.get('/users/setting/:id', authenticatedUser, userController.getSetting)

    app.get('/admin/login', adminController.signInPage)
    app.post('/admin/login', passport.authenticate('local', { failureRedirect: '/admin/login', failureFlash: true }), adminController.signIn)
    app.get('/admin/logout', adminController.logout)
    app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)

}