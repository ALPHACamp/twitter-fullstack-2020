const express = require('express')
const router = express.Router()
// const { userController } = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const admin = require('./modules/admin')
// const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)

router.get('/tweets', tweetController.getTweets)
// authenticated還沒載入 還沒寫這功能
// router.post('/followships/:userId', authenticated, userController.addFollowing)
// router.delete('/followships/:userId', authenticated, userController.deleteFollowing)

router.get('/', (req, res) => { res.redirect('/tweets') })
router.use('/', generalErrorHandler)

module.exports = router
