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
            return res.redirect('back')
        } else {
            return next()
        }
    }
    res.redirect('/login')
}
const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
        if (helpers.getUser(req).isAdmin==1 || helpers.getUser(req).role == 'admin') {
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

router.get('/register', userController.registerPage)
router.post('/register', userController.userRegister)



//Admin
router.get('/admin/signin', adminController.signinPage)
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signin)
router.get('/admin/logout', adminController.logout)

router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)

router.get('/admin/users', authenticatedAdmin, adminController.getUsers)



// User
router.get('/login', userController.loginPage)
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.login)
router.get('/logout', userController.logout)


router.get('/tweets', authenticated, userController.getTopUsers, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)
router.get('/tweets/:id/replies', authenticated, userController.getTopUsers, tweetController.getTweet)
router.post('/tweets/:id/replies', authenticated, replyController.postReply)
router.post('/tweets/like/:tweetId', authenticated, userController.addLike)
router.delete('/tweets/like/:tweetId', authenticated, userController.removeLike)
router.post('/tweet/like/:tweetId', authenticated, userController.addLike)
router.delete('/tweet/like/:tweetId', authenticated, userController.removeLike)



router.get('/profile/:id', authenticated, userController.getTopUsers, userController.getUser)
router.post('/api/user/:id', authenticated, upload.fields([{ name: 'avatar' }, { name: 'cover' }]), userController.postProfile)
router.get('/users/:id/replied', authenticated, userController.getTopUsers, userController.getReplied)
router.get('/users/:id/likes', authenticated, userController.getTopUsers, userController.getLiked)

router.get('/users/:id/setting', authenticated, userController.settingPage)
router.put('/users/:id', authenticated, userController.putSetting)
router.get('/users/:id/follower', authenticated, userController.getTopUsers, userController.getFollowers)
router.get('/users/:id/following', authenticated, userController.getTopUsers, userController.getFollowings)
router.post('/followships/:userId', authenticated, userController.addFollowing)
router.delete('/followships/:userId', authenticated, userController.removeFollowing)










// 匯出路由器
module.exports = router
