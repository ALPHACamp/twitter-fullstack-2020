const helpers = require('../_helpers')
const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const adminController = require('../controllers/adminController')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }

  res.redirect('/login')
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === "admin") {
      return next()
    }
    return res.redirect('/')
  }
  res.redirect('/signin')
}

module.exports = app => {


//TODO:測試用路由
app.get('/', authenticated, (req, res) => {
  res.render('index')
})

app.get('/setting', (req, res) => {
  res.render('accountSetting')
})

// //TODO: 功能完成後可解除對應的註解(若VIEW還沒完成先連到register測試)
// //使用者顯示主頁面
// router.get('/current_user', userController.getCurrentUser)


// //TopUsers(要改成api)
// router.get('/users/top', userController.getTopUsers)
// //使用者顯示特定使用者頁面
// router.get('/users/:user_id', userController.getUser)
// //使用者編輯個人頁面(要改成api)
// router.put('/users/:user_id/profile', userController.putUser)
// //使用者所有貼文
// router.get('/users/:user_id/tweets', userController.getUserTweets)
// //使用者所有喜歡貼文
// router.get('/users/:user_id/likes', userController.getUserLikeTweets)
// //使用者所有回覆
// router.get('/users/:user_id/replied_tweets', userController.getUserReplies)
// //使用者追蹤清單
// router.get('/users/:user_id/followings', userController.getUserFollowings)
// //使用者粉絲清單(被追蹤)
// router.get('/users/:user_id/followers', userController.getUserFollowers)

// //追蹤使用者
// router.post('/following/:user_id', userController.addFollowing)
// //取消追蹤使用者
// router.delete('/following/:user_id', userController.removeFollowing)

TODO:// //顯示所有貼文(要改api)
// router.get('/tweets', tweetController.getTweets)
// //顯示特定貼文
// router.get('/tweets/:id', tweetController.getTweet)
// //回覆特定貼文
// router.post('tweets/:id/replies', tweetController.createTweetReplies)
// //顯示特定貼文回覆
// router.get('/tweets/:id/replies', tweetController.getTweetReplies)
// //喜歡特定貼文
// router.post('/tweets/:id/like', tweetController.addLike)
// //取消喜歡特定貼文
// router.delete('/tweets/:id/like', tweetController.removeLike)


// //管理者登入(後台登入)
// router.get('/admin/login', adminController.loginPage)
// router.post('/admin/login', adminController.login)
// //管理者顯示所有貼文
// router.get('/admin/tweets', adminController.getTweets)
// //管理者刪除貼文
// router.delete('/admin/tweets/:id', adminController.deleteTweets)
// //管理者顯示所有使用者
// router.get('/admin/tweets', adminController.getUsers)


// //使用者登入頁面
router.get('/login', userController.loginPage)
router.post('/login', userController.login)
// //使用者編輯帳號頁面
router.get('/users/:user_id/edit', userController.editAccount)
// router.put('/users/:user_id', userController.putAccount)
// //註冊
router.get('/register', userController.registerPage)
router.post('/register', userController.register)
// //登出
router.get('/logout', userController.logout)

}
// module.exports = router