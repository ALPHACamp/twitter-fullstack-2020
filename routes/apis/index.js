const express = require('express')
const router = express.Router()
const { apiErrorHandler } = require('../../middleware/error-handler')
const upload = require('../../middleware/multer')
const passport = require('../../config/passport')
// const { authenticated, authenticatedAdmin } = require('../../middleware/auth')
const { generalErrorHandler } = require('../../middleware/error-handler') //


const userController = require('../../controllers/apis/user-controller')
const tweetController = require('../../controllers/apis/tweet-controller')

router.get('/api/users/:id/tweets', userController.getUserTweets)
router.get('/api/users/:id/replies', userController.getUserReplies)
router.get('/api/users/:id/likes', userController.getUserLikes)
router.get('/api/users/:id/followers', userController.getUserFollowers)
router.get('/api/users/:id/followings', userController.getUserFollowings)
router.post('/api/users/:id/follow', userController.addFollowing)
router.delete('/api/users/:id/follow', userController.removeFollowing)


router.get('/api/tweets/:id/like', tweetController.getLikeCount)
router.post('/api/tweets/:id/like', tweetController.addLike)
router.delete('/api/tweets/:id/like', tweetController.removeLike)
router.post('/api/tweets/:id/replies', tweetController.postReply)

router.get('/api/tweets/:id', tweetController.getTweet)
router.post('/api/tweets/', tweetController.postTweet)


// 瀏覽編輯使用者頁面 GET /api/users/:id
router.get('/api/users/:id', userController.editUserPage)
// 更新使用者的資訊 POST /api/users/:id, upload.single('image')
router.post('/api/users/:id', upload.fields([
  { name: 'name', maxCount: 1 },
  { name: 'introduction', maxCount: 1 },
  { name: 'croppedAvatar', maxCount: 1 },
  { name: 'croppedCoverage', maxCount: 1 }
]), userController.editUser)
router.use('/', apiErrorHandler)







module.exports = router
