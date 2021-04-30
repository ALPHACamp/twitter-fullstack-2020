// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

const helpers = require('../_helpers')

const tweetController = require('../controllers/tweetController.js')
const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController.js')
const replyController = require('../controllers/replyController.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const passport = require('../config/passport')


const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
        if (helpers.getUser(req).isAdmin == 1 || helpers.getUser(req).role == 'admin') {
            req.flash('error_messages', '登入錯誤！')
            return res.redirect('/admin/tweets')
        } else {
            return next()
        }
    }
    res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
        if (helpers.getUser(req).isAdmin == 1 || helpers.getUser(req).role == 'admin') {
            return next()
        }
        else {
            req.flash('error_messages', '登入錯誤！')
            return res.redirect('back')
        }

    }
    res.redirect('/admin/signin')
}



// 準備引入路由模組
router.get('/', (req, res) => res.redirect('/tweets'))


//Admin
router.get('/admin/signin', adminController.signinPage)
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signin)
router.get('/admin/signout', adminController.signout)
router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)



// User
router.get('/signin', userController.signinPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signin)
router.get('/signout', userController.signout)
router.get('/signup', userController.signupPage)
router.post('/signup', userController.userSignup)


router.get('/tweets', authenticated, userController.getTopUsers, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)
router.get('/tweets/:id/replies', authenticated, userController.getTopUsers, tweetController.getTweet)
router.post('/tweets/:id/replies', authenticated, replyController.postReply)
router.post('/tweets/:tweetId/like', authenticated, userController.addLike)
router.post('/tweets/:tweetId/unlike', authenticated, userController.removeLike)



router.get('/users/:id/tweets', authenticated, userController.getTopUsers, userController.getUser)

router.get('/api/users/:id', authenticated,userController.editProfile)
router.post('/api/users/:id', authenticated, upload.fields([{ name: 'avatar' }, { name: 'cover' }]), userController.postProfile)

router.get('/users/:id/replied', authenticated, userController.getTopUsers, userController.getReplied)
router.get('/users/:id/likes', authenticated, userController.getTopUsers, userController.getLiked)

router.get('/users/:id/setting', authenticated, userController.settingPage)
router.put('/users/:id', authenticated, userController.putSetting)
router.get('/users/:id/followers', authenticated, userController.getTopUsers, userController.getFollowers)
router.get('/users/:id/followings', authenticated, userController.getTopUsers, userController.getFollowings)
router.post('/followships/:userId', authenticated, userController.addFollowing)
router.delete('/followships/:userId', authenticated, userController.removeFollowing)










// 匯出路由器
module.exports = router
