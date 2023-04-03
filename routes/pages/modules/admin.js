const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/pages/admin/admin-controller')



router.delete('/tweets/:id', adminController.deleteTweet)
router.get('/tweets', adminController.adminTweets)
router.get('/users', adminController.adminUsers)

router.use('/', (req, res) => res.redirect('/tweets'))
module.exports = router