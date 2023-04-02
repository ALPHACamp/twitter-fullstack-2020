const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/pages/admin/admin-controller')



router.get('/signin', adminController.adminSignin)
router.get('/tweets', adminController.adminTweets)
router.get('/users', adminController.adminUsers)

router.use('/', (req, res) => res.redirect('/tweets'))
module.exports = router