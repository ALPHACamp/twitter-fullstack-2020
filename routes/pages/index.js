const express = require('express')
const router = express.Router()
// const passport = require('../../config/passport')
// const { authenticated, authenticatedAdmin } = require('../../middleware/auth')
// const upload = require('../../middleware/multer')
// const { generalErrorHandler } = require('../../middleware/error-handler') // 加


const userController = require('../../controllers/pages/page-controller')
const tweetController = require('../../controllers/pages/tweet-controller')




router.get('/tweets/', tweetController.getTweets)
router.use('/', (req, res) => res.redirect('/tweets'))

module.exports = router
