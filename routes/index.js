const tweetController = require('../controllers/tweetController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
module.exports = app => {

    // 前台路由部分
    // ================================================================
    //如果使用者訪問首頁，就導向 /tweets 的頁面
    //在 /tweets 底下則交給 tweetController.getTweets 來處理
    app.get('/', (req, res) => res.redirect('/tweets'))
    app.get('/tweets', tweetController.getTweets)

    app.get('/signup', userController.getSignUpPage)
    app.post('/signup', userController.postSignUp)

    app.get('/signin', userController.getSignInPage)
    // 後台路由部分
    // ================================================================
    //如果使用者訪問首頁，就導向 /admin/users 的頁面
    //在 /tweets 底下則交給 adminController.getTweets 來處理

    app.get('/admin/signin', adminController.getSignInPage)

    app.get('/admin', (req, res) => {
        res.redirect('/admin/users')
    })

    app.get('/admin/users', adminController.getTweets)
}