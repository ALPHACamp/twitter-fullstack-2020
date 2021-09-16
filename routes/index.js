const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const helpers = require('../_helpers')

module.exports = (app, passport) => {
    const authenticated = (req, res, next) => {
        if (helpers.ensureAuthenticated(req)) {
            return next()
        }
        res.redirect('/signin')
    }

    const authenticatedAdmin = (req, res, next) => {
        if (helpers.ensureAuthenticated(req)) {
            if (helpers.getUser(req).role === 'admin') {
                return next()
            }
            req.flash('error_messages', '此帳號非管理者帳號！')
            return res.redirect('/admin/signin')
        }
        res.redirect('/admin/signin')

    }

    const authenticatedUser = (req, res, next) => {
        if (helpers.ensureAuthenticated(req)) {
            if (helpers.getUser(req).role !== 'admin') { return next() }
            req.flash('error_messages', '此帳號為管理者帳號，不可登入前台！')
            return res.redirect('/signin')
        }
        res.redirect('/signin')
    }

    const authenticatedUserTweets = (req, res, next) => {
        if ((req.url === "/tweets") & (helpers.getUser(req).role === 'admin')) {
            return res.redirect('/admin/tweets')
        } return next()
    }

    app.get('/signup', userController.signUpPage)
    app.post('/signup', userController.signUp)
    app.get('/signin', userController.signInPage)
    app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
    app.get('/signout', userController.logout)

    app.get('/tweets', authenticatedUserTweets, authenticatedUser, userController.getTweets)

    app.get('/admin/signin', adminController.signInPage)
    app.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)
    app.get('/admin/logout', adminController.logout)
    app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
    app.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
    app.get('/admin/users', authenticatedAdmin, adminController.getUsers)

}