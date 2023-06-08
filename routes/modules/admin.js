const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

router.get('/signin', adminController.signInPage)
router.get('/tweets', adminController.tweetsPage)
router.get('/users', adminController.usersPage)

module.exports = router
