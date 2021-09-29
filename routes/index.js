const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const tweetController = require('../controllers/tweetController')
const helpers = require('../_helpers')
const replyController = require('../controllers/replyController')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

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
            return res.redirect('/admin/tweets')
        }
    }

    // for test
    app.get('/tweets/:id/replies', authenticatedUser, tweetController.getTweet)
    // for test尾
    app.get('/tweets/:id', authenticatedUser, tweetController.getTweet)
    app.get('/tweets', authenticatedUser, tweetController.getTweets)
    app.post('/tweets/:id/replies', replyController.postReply)
    app.post('/tweets', tweetController.postTweet)
    app.post('/tweets/:TweetId/like', authenticatedUser, userController.addLike)
    app.post('/tweets/:TweetId/unlike', userController.removeLike)

    app.get('/signup', userController.signUpPage)
    app.post('/signup', userController.signUp)
    app.get('/signin', userController.signInPage)
    app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
    app.get('/signout', userController.logout)

    app.get('/setting', authenticatedUser, userController.getSetting)
    app.put('/setting', authenticatedUser, userController.putSetting)

    app.get('/users/:id/followers', authenticatedUser, userController.getFollowers)
    app.get('/users/:id/followings', authenticatedUser, userController.getFollowings)
    app.get('/users/:id', authenticatedUser, userController.getProfile)
    app.get('/users/noti/:id', authenticatedUser, userController.toggleNotice)
    app.get('/users/:id/tweets', authenticatedUser, userController.getProfile)
    app.put('/users/:id/edit', authenticatedUser, upload.fields([{
        name: 'cover', maxCount: 1
    }, {
        name: 'avatar', maxCount: 1
    }]), userController.putProfile)
    app.post('/followships', authenticatedUser, userController.addFollowing)
    app.delete('/followships/:userId', authenticatedUser, userController.removeFollowing)

    app.get('/admin/signin', adminController.signInPage)
    app.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)
    app.get('/admin/logout', adminController.logout)
    app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
    app.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
    app.get('/admin/users', authenticatedAdmin, adminController.getUsers)

    app.get('/', authenticated, (req, res) => res.redirect('/tweets'))

}