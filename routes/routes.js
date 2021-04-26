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
        if (helpers.getUser(req).isAdmin) {
            req.flash('error_messages', '登入錯誤！')
            return res.redirect('/login')
        } else {
            return next()
        }
    }
    res.redirect('/login')
}
const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
        if (helpers.getUser(req).isAdmin) {
            return next()
        }
        else {
            req.flash('error_messages', '登入錯誤！')
            return res.redirect('/admin/login')
        }

    }
    res.redirect('/admin/login')
}



// 準備引入路由模組


router.get('/', (req, res) => res.redirect('/tweets'))

router.get('/register', userController.registerPage)
router.post('/register', userController.userRegister)



//Admin
router.get('/admin/login', adminController.loginPage)
router.post('/admin/login', passport.authenticate('local', { failureRedirect: '/admin/login', failureFlash: true }), adminController.login)
router.get('/admin/logout', adminController.logout)

router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)

router.get('/admin/users', authenticatedAdmin, adminController.getUsers)



// User
router.get('/login', userController.loginPage)
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.login)
router.get('/logout', userController.logout)


router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, userController.postTweet)
router.get('/tweets/:id', authenticated, tweetController.getTweet)
router.post('/tweets/:id/replies', authenticated, replyController.postReply)
router.post('/like/:tweetId', authenticated, userController.addLike)
router.delete('/like/:tweetId', authenticated, userController.removeLike)



router.get('/profile/:id', authenticated, userController.getUser)
router.get('/users/:id/setting', authenticated, userController.settingPage)
router.put('/users/:id', authenticated, userController.putSetting)
router.get('/users/:id/follower', authenticated, userController.getFollowers)
router.get('/users/:id/following', authenticated, userController.getFollowings)
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)










// 匯出路由器
module.exports = router
