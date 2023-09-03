const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/apis/tweet-controller')
const userController = require('../../controllers/apis/user-controller')
const upload = require('../../middleware/multer')
const { authenticated } = require('../../middleware/auth')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.get('/tweets/:id', tweetController.getTweet)
router.get('/users/checkAccount/:account', userController.checkAccount)
router.get('/users/:userId', authenticated, userController.getUser)
router.post('/users/:userId', authenticated, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), userController.postUser)
router.use('/', apiErrorHandler)

module.exports = router
