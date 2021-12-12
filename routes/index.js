const tweetController = require('../controllers/tweetController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const passport = require('passport')
const multer = require('multer')
const { helpers } = require('faker')
const upload = multer({ dest: 'temp/' })
const _helpers = require('../_helpers')
module.exports = (app, passport) => {

    const authenticated = (req, res, next) => {
        console.log('== req.isAuthenticated ==')
        console.log(req.isAuthenticated())
        if (req.isAuthenticated()) {
            if (req.user.role === '0') {
                console.log('使用者為normal user....')
                return next()
            } else {
                console.log('使用者為admin....')
            }
        }

        console.log('使用者沒通過認證....')
        req.flash('error_messages', '帳號錯誤!')
        return res.redirect('/signin')
    }

    const authenticatedAdmin = (req, res, next) => {

        if (_helpers.ensureAuthenticated(req)) {

            if (_helpers.getUser(req).role === '1') {
                _helpers.getUser(req).role = 'admin'
            }
            if (_helpers.getUser(req).role === 'admin') {
                return next()
            }
        }
        req.flash('error_messages', '帳號錯誤!')
        return res.redirect('/admin/signin')
    }


    // 前台路由部分
    // ================================================================


    // 註冊
    app.get('/signup', userController.getSignUpPage)
    app.post('/signup', userController.postSignUp)

    // 登入
    app.get('/signin', userController.getSignInPage)
    app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.postSignIn)

    // 登出
    app.get('/logout', userController.getlogout)


    // 推文首頁

    app.get('/', authenticated, (req, res) => res.redirect('/tweets'))

    app.get('/tweets', authenticated, tweetController.getTweets)

    app.post('/tweets', authenticated, tweetController.postTweets)



    // 追隨

    app.post('/followships/:userId', authenticated, userController.addFollowing)
    app.delete('/followships/:userId', authenticated, userController.removeFollowing)

    // 帳戶設定

    app.get('/setting', authenticated, userController.getSetting)
    app.put('/setting', authenticated, userController.postSetting)

    //  前台個人資料

    app.get('/users/:id/tweets', authenticated, userController.getUserSelf)

    // 取得特定推文留言資料
    app.post('/tweets/:id/replies', authenticated, tweetController.postReplies)
    app.get('/tweets/:id/replies', authenticated, tweetController.getReplies)


    // 前台 like 特定 Tweet
    app.post('/tweets/:id/like', authenticated, tweetController.postLike)
    app.post('/tweets/:id/unlike', authenticated, tweetController.postUnLike)


    // 前台查看跟隨了那些人
    app.get('/user/:id/followings', authenticated, userController.getFollowings)

    // 前台查看被那些人跟隨
    app.get('/user/:id/followers', authenticated, userController.getFollowers)

    // 前台查看喜歡那些推文
    app.get('/users/:id/likes', authenticated, userController.getLike)
    // 前台查看推文與回覆
    app.get('/users/:id/replies', authenticated, userController.getTweetReply)

    app.get('/chatroomPublic', authenticated, userController.getChatroomPublic)


    // 後台路由部分
    // ================================================================
    //如果使用者訪問首頁，就導向 /admin/users 的頁面
    //在 /tweets 底下則交給 adminController.getTweets 來處理

    // 後台登入
    app.get('/admin/signin', adminController.getSignInPage)
    app.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.postSignInPage)

    app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)

    app.get('/admin/users', authenticatedAdmin, adminController.getUsers)

    app.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)

    app.get('/api/users/:id', userController.getUserApi)

    // app.put('/api/users/:id', upload.single('avatar'), userController.putUserApi)
    const imageData = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])
    app.put('/api/users/:id', imageData, userController.putUserApi)

}