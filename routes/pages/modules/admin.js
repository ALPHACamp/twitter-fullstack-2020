const router = require('express').Router()
const adminController = require('../../../controllers/pages/admin-controller')

router.get('/tweets', adminController.getTweets)

module.exports = router
