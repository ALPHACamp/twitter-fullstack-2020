const express = require('express')
const router = express.Router()
const adminController = require('../../controller/admin-controller')

router.delete('/tweets/:id', adminController.deleteTweet)
router.get('/tweets', adminController.getTweets)
router.get('/users', adminController.getUsers)


// 要在 router 部分裡面  新增 authenticatedAdmin (管理者認證)


module.exports = router
