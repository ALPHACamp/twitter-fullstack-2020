const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/signin', adminController.signInPage)
router.post('/signin', adminController.signIn)
router.get('/tweets', adminController.getAdminTweets)

router.use('/', (req, res) => res.redirect('/admin/tweets'))

module.exports = router
