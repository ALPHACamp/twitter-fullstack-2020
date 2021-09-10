const helpers = require('../_helpers')
const express = require('express')
const router = express.Router()
// const passport = require('../config/passport')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const adminController = require('../controllers/adminController')

// TODO:9/10暫定
// TODO: Kyle 畫面+followship
// TODO: Johnson user+like
// TODO: Vanessa tweet+reply

router.get('/', (req, res) => {
  res.render('index')
})


// //使用者顯示主頁面
// router.get('/current_user', userController.getCurrentUser)


// //TopUsers(要改成api)
// router.get('/users/top', userController.getTopUsers)
// //使用者顯示特定使用者頁面
// router.get('/users/:id', userController.getUser)
// //使用者編輯個人頁面(要改成api)
// router.get('/users/:id/edit', userController.editUser)
// router.put('/users/:id', userController.putUser)
// //使用者所有貼文
// router.get('/users/:id/tweets', userController.getUserTweets)
// //使用者所有喜歡貼文
// router.get('/users/:id/likes', userController.getUserLikeTweets)
// //使用者所有回覆
// router.get('/users/:id/replied_tweets', userController.getUserReplies)
// //使用者追蹤清單
// router.get('/users/:id/followings', userController.getUserFollowings)
// //使用者粉絲清單(被追蹤)
// router.get('/users/:id/followers', userController.getUserFollowers)

// //追蹤使用者
// router.post('/following/:userId', userController.addFollowing)
// //取消追蹤使用者
// router.delete('/following/:userId', userController.removeFollowing)

// //顯示所有貼文(要改api)
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
// router.get('/admin/signin', adminController.signInPage)
// router.post('/admin/signin', adminController.signIn)
// //管理者顯示所有貼文
// router.get('/admin/tweets', adminController.getTweets)
// //管理者刪除貼文
// router.delete('/admin/tweets/:id', adminController.deleteTweets)
// //管理者顯示所有使用者
// router.get('/admin/tweets', adminController.getUsers)


// //使用者登入頁面
// router.get('/signin', userController.signInPage)
// router.post('/signin', userController.signIn)
// //註冊
// router.get('/signup', userController.signUpPage)
// router.post('/signup', userController.signUp)
// //登出
// router.get('/logout', userController.logout)

module.exports = router